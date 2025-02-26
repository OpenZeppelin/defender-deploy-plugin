<script lang="ts">
  import { onDestroy } from "svelte";

  // Lib
  import { updateSelectedApprovalProcessWithExisting, clearErrorBanner, globalState, setDeploymentCompleted, setErrorBanner } from "$lib/state/state.svelte";
  import { log, logError, logSuccess, logWarning } from "$lib/remix/logger";
  import { deployContract, switchToNetwork } from "$lib/ethereum";
  import { API } from "$lib/api";

  // Utils
  import { attempt } from "$lib/utils/attempt";
  import { isDeploymentEnvironment, isSameNetwork } from "$lib/utils/helpers";
  import { getContractFeatures, getConstructorInputs, encodeConstructorArgs, getContractBytecode, createArtifactPayload } from "$lib/utils/contracts";

  // Models
  import { getNetworkLiteral, isProductionNetwork, type TenantNetworkResponse } from "$lib/models/network";
  import type { ApprovalProcess, CreateApprovalProcessRequest} from "$lib/models/approval-process";
  import type { DeployContractRequest, UpdateDeploymentRequest } from "$lib/models/deploy";
  import type { APIResponse } from "$lib/models/ui";

  // Components
  import Button from "./shared/Button.svelte";

  interface DeploymentResult {
    address: string;
    hash: string;
    sender?: string;
  }

  let contractName: string | undefined;
  let contractBytecode: string | undefined;
  let artifactPayload: string | undefined;
  let salt: string | undefined;
  let inputsWithValue: Record<string, string | number | boolean> = {};
  let contractPath: string | undefined;
  let timeout: NodeJS.Timeout | undefined;

  let deploying = $state(false);
  let isDeterministic = $state(false);
  let deploymentResult = $state<{ address: string, hash: string } | undefined>(undefined);
  let deploymentId = $state<string | undefined>(undefined);
  const deploymentUrl = $derived(
  deploymentId && globalState.form.network
    ? `https://defender.openzeppelin.com/#/deploy/environment/${
        isProductionNetwork(globalState.form.network) ? 'production' : 'test'
      }?deploymentId=${deploymentId}`
    : undefined
  );

   const inputs = $derived.by(() => {
    const path = globalState.contract?.target ?? "";
    const compilation = globalState.contract?.data;
    return getConstructorInputs(path, compilation);
  });

  const contractInfo = $derived.by(() => {
    const path = globalState.contract?.target ?? "";
    const compilation = globalState.contract?.data;
    
    if (!compilation || !path) {
      return { path: "", name: "" };
    }

    const { name } = getContractFeatures(path, compilation);
    return { path, name };
  });

  let enforceDeterministic = $derived.by(() => {
    const selectedMultisig = globalState.form.approvalType === 'existing' && globalState.form.approvalProcessSelected?.viaType === "Safe";
    const toCreateMultisig = globalState.form.approvalType === 'new' && globalState.form.approvalProcessToCreate?.viaType === "Safe";
    return selectedMultisig || toCreateMultisig;
  });

  $effect(() => {
    contractPath = contractInfo.path;
    contractName = contractInfo.name;
  });

  $effect(() => {
    if (contractInfo.path && contractInfo.name && globalState.contract?.data) {
      contractBytecode = getContractBytecode(
        contractInfo.path,
        contractInfo.name,
        globalState.contract.data.contracts
      );
    }
  });

  $effect(() => {
    if (contractInfo.path && globalState.contract?.data && globalState.contract?.source?.sources) {
      artifactPayload = createArtifactPayload(
        contractInfo.path,
        globalState.contract.source.sources,
        globalState.contract.data.contracts
      );
    }
  });
  
  function findDeploymentEnvironment(via?: string, network?: string) {
    if (!via || !network) return undefined;
    return globalState.approvalProcesses.find((ap) => 
      ap.network &&
      isDeploymentEnvironment(ap) &&
      isSameNetwork(ap.network, network) &&
      ap.via?.toLocaleLowerCase() === via.toLocaleLowerCase()
    );
  }

  async function getOrCreateApprovalProcess(): Promise<ApprovalProcess | undefined> {
    const ap = globalState.form.approvalProcessToCreate;
    if (!ap || !ap.via || !ap.viaType) {
      setErrorBanner("Please select an approval process");
      return;
    }

    if (!globalState.form.network) {
      setErrorBanner("Please select a network");
      return;
    }

    const existing = findDeploymentEnvironment(ap.via, ap.network);
    if (existing) {
      return existing;
    }

    log("[Defender Deploy] Creating deployment environment in Defender...");
    const apRequest: CreateApprovalProcessRequest = {
      name: `Deploy From Remix - ${ap.viaType}`,
      via: ap.via,
      viaType: ap.viaType,
      network: getNetworkLiteral(globalState.form.network),
      relayerId: ap.relayerId,
      component: ["deploy"],
    };
    const result: APIResponse<{ approvalProcess: ApprovalProcess }> =
      await API.createApprovalProcess(apRequest);

    if (!result.success) {
      setErrorBanner(result.error);
      deploying = false;

      // log error in Remix terminal
      logError(
        `[Defender Deploy] Approval process creation failed, error: ${JSON.stringify(result.error)}`,
      );
      return;
    }

    logSuccess("[Defender Deploy] Deployment Environment successfully created");
    logWarning("Warning: The created Deployment Environment has Deploy Approval Process configuration only, the Block Explorer API Key and Upgrade Approval Process are not set");
    if (!result.data) return;

    updateSelectedApprovalProcessWithExisting(result.data.approvalProcess)
    return result.data.approvalProcess;
  }

  function logDeploymentResult(result: DeploymentResult) {
    logSuccess(`[Defender Deploy] Contract deployed, address: ${result.address}, tx hash: ${result.hash}`);
  }

  function listenForDeployment(deploymentId: string) {
    // polls the deployment status every 10 seconds
    log("[Defender Deploy] Waiting for deployment...");
    const interval = 10000;
    timeout = setInterval(async () => {
      const result: APIResponse<{ address: string, hash: string }> = await API.getDeployment(deploymentId);
      if (result.success && result.data?.address) {
        deploymentResult = {
          address: result.data.address,
          hash: result.data.hash,
        };
        logDeploymentResult(deploymentResult);
        clearInterval(timeout);
      }
    }, interval);
  }

  export async function handleInjectedProviderDeployment(bytecode: string) {
    // Switch network if needed
    const [, networkError] = await attempt(async () => switchToNetwork(globalState.form.network!));
    if (networkError) {
      throw new Error(`Error switching network: ${networkError.msg}`);
    }

    log("[Defender Deploy] deploying contract...");
    const [result, error] = await attempt(async () => deployContract(bytecode));
    if (error) {
      throw new Error(`Error deploying contract: ${error.msg}`);
    }

    if (!result) {
      throw new Error("Deployment result not found");
    }

    logSuccess(`[Defender Deploy] Contract deployed, tx hash: ${result?.hash}`);
    
    return {
      address: result.address,
      hash: result.hash,
      sender: result.sender
    };
  }

  export async function createDefenderDeployment(request: DeployContractRequest) {
    log("[Defender Deploy] Creating contract deployment in Defender...");
    const result: APIResponse<{ deployment: { deploymentId: string } }> =
      await API.createDeployment(request);

    if (!result.success || !result.data) {
      throw new Error(`Contract deployment creation failed: ${JSON.stringify(result.error)}`);
    }

    return result.data.deployment.deploymentId;
  }

  export async function updateDeploymentStatus(
    deploymentId: string,
    address: string,
    hash: string
  ) {
    const updateRequest: UpdateDeploymentRequest = {
      deploymentId,
      hash,
      address,
    };
    
    const result = await API.updateDeployment(updateRequest);
    if (!result.success) {
      throw new Error(`Failed to update deployment status: ${JSON.stringify(result.error)}`);
    }
  }

  async function triggerDeployment() {
    if (!globalState.form.network || !contractName || !contractPath || !contractBytecode) return;

    clearErrorBanner();
    setDeploymentCompleted(false);
    deploying = true;

    if ((enforceDeterministic || isDeterministic) && !salt) {
      logError("[Defender Deploy] Salt is required for deterministic deployments.");
      deploying = false;
      return;
    }

    const [constructorBytecode, constructorError] = await encodeConstructorArgs(inputs, inputsWithValue);
    if (constructorError) {
      logError(`[Defender Deploy] Error encoding constructor arguments: ${constructorError.msg}`);
      deploying = false;
      return;
    }

    let deploymentDetails: DeploymentResult | undefined;

    // contract deployment requires contract bytecode
    // and constructor bytecode to be concatenated.
    const bytecode = contractBytecode + constructorBytecode?.slice(2);

    const shouldUseInjectedProvider = globalState.form.approvalType === "injected";
    if (shouldUseInjectedProvider) {
      const [result, error] = await attempt(async () =>
        handleInjectedProviderDeployment(bytecode),
      );
      if (error) {
        logError(`[Defender Deploy] ${error.msg}`);
        deploying = false;
        return;
      }

      deploymentDetails = result;

      // loads global state with EOA approval process to create
      globalState.form.approvalProcessToCreate = {
        viaType: "EOA",
        via: deploymentDetails?.sender,
        network: getNetworkLiteral(globalState.form.network),
      };
      globalState.form.approvalProcessSelected = undefined;
    }

    const approvalProcess = globalState.form.approvalProcessSelected ?? await getOrCreateApprovalProcess();
    if (!approvalProcess) {
      deploying = false;
      logError("[Defender Deploy] No Approval Process selected");
      return;
    };

    const deployRequest: DeployContractRequest = {
      contractName,
      network: getNetworkLiteral(globalState.form.network),
      approvalProcessId: approvalProcess.approvalProcessId,
      contractPath,
      verifySourceCode: true,
      artifactPayload,
      constructorBytecode,
      salt: isDeterministic || enforceDeterministic ? salt : undefined,
      origin: 'Remix',
    };
    const [newDeploymentId, deployError] = await attempt(async () => createDefenderDeployment(deployRequest));
    if (deployError) {
      logError(`[Defender Deploy] ${deployError.msg}}`);
      setErrorBanner(deployError.msg);
      deploying = false;
      return;
    }
    if (!newDeploymentId) {
      logError("[Defender Deploy] Deployment failed to create");
      deploying = false;
      return;
    }

    if (shouldUseInjectedProvider && deploymentDetails) {
      const [, updateError] = await attempt(async () => updateDeploymentStatus(
        newDeploymentId,
        deploymentDetails.address,
        deploymentDetails.hash
      ));
      if (updateError) {
        logError(`[Defender Deploy] ${updateError.msg}`);
        deploying = false;
        return;
      }
      logDeploymentResult(deploymentDetails);
    } else {
      // If we're not using an injected provider
      // we need to listen for the deployment to be finished.
      listenForDeployment(newDeploymentId);
    }

    deploymentId = newDeploymentId;
    logSuccess("[Defender Deploy] Deployment submitted to Defender!");
    setDeploymentCompleted(true);
    deploying = false;
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    inputsWithValue[target.name] = target.value;
  }

  function handleSaltChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    salt = target.value;
  }

  onDestroy(() => {
    if (timeout) {
      clearInterval(timeout);
    }
  });
</script>

<input
  type="text"
  class="btn btn-secondary col form-control"
  value={globalState.contract?.target ?? "Compile Contract"}
  disabled
/>

<div class="pt-2">
  <div class="form-check">
    <input 
      class="form-check-input" 
      type="checkbox" 
      id="isDeterministic" 
      checked={isDeterministic || enforceDeterministic} 
      onchange={() => (isDeterministic = !isDeterministic)}
      disabled={enforceDeterministic}
    >
    <label class="form-check-label" for="isDeterministic">
      Deterministic
    </label>
    {#if enforceDeterministic}
      <i class="fa fa-question-circle ml-2" title="When using a Safe as the approval process, the salt is required to be deterministic."></i>
    {/if}
  </div>
</div>


{#if isDeterministic || enforceDeterministic}
  <label for="salt">{`Salt`}</label>
  <input
    name="salt"
    type="text"
    class="form-control"
    placeholder={"Salt"}
    onchange={handleSaltChanged}
  />
{/if}

{#each inputs as input}
  <label for="apiSecret">{`${input.name} (${input.type})`}</label>
  <input
    name={input.name}
    type="text"
    class="form-control"
    placeholder={input.name}
    onchange={handleInputChange}
  />
{/each}

<Button title="Deploy" onclick={triggerDeployment} loading={deploying} />

{#if globalState.form.completed}
<div class="alert alert-success d-flex align-items-center mt-2">
  <i class="fa fa-check-circle-o mr-2"></i>
  <p class="m-0">
    <small class="lh-sm">
      {#if deploymentResult}
        Contract deployed
      {:else}
        Contract deployment submitted to Defender!
      {/if}
      <br>
      {#if deploymentUrl}
        <a class="text-success" href={deploymentUrl} target="_blank">
          View Deployment
        </a>
      {/if}
    </small>
  </p>
</div>
{/if}

<style>
  input[type=checkbox] {
    top: 2px;
  }
</style>
