<script lang="ts">
  import { globalState } from "$lib/state/state.svelte";
  import type {
    ABIDescription,
    ABIParameter,
    CompilationResult,
  } from "@remixproject/plugin-api";
  import Button from "./shared/Button.svelte";
  import { AbiCoder } from "ethers";
  import { attempt } from "$lib/utils";
  import { log, logError, logSuccess } from "$lib/remix/logger";
  import type {
    ApprovalProcess,
    CreateApprovalProcessRequest,
  } from "$lib/models/approval-process";
  import type {
    DeployContractRequest,
    UpdateDeploymentRequest,
  } from "$lib/models/deploy";
  import { deployContract, switchToNetwork } from "$lib/ethereum";
  import { API } from "$lib/api";
  import type { APIResponse } from "$lib/models/ui";

  let contractName: string | undefined;
  let contractBytecode: string | undefined;
  let artifactPayload: string | undefined;
  let salt: string | undefined;
  let inputsWithValue: Record<string, string | number | boolean> = {};
  let contractPath: string | undefined;

  let deploymentId = $state<string | undefined>(undefined);
  let deploying = $state(false);
  let isDeterministic = $state(false);

  /**
   * Finds constructor arguments and loads contract features.
   */
  const inputs = $derived.by(() => {
    const path = globalState.contract?.target ?? "";
    const compilation = globalState.contract?.data;
    const contractSources = globalState.contract?.source?.sources;

    // if no compiled contracts found, then return empty inputs.
    if (!compilation || !path) return [];

    const { name, abi } = getContractFeatures(path, compilation);

    contractPath = path;
    contractName = name;
    contractBytecode = compilation.contracts[path][name].evm.bytecode.object;

    artifactPayload = JSON.stringify({
      input: {
        sources: {
          // weird typing in contract sources
          [path]: { content: (contractSources as any)[path].content },
        },
        settings: {
          // we don't actually need these settings, but they are required in type.
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      output: {
        contracts: { ...compilation.contracts },
      },
    });

    const constructor = abi.find((fragment) => fragment.type === "constructor");
    if (!constructor || !constructor.inputs) return [];
    return constructor.inputs as ABIParameter[];
  });

  function getContractFeatures(
    path: string,
    compilation: CompilationResult,
  ): { name: string; abi: ABIDescription[] } {
    const contracts = compilation.contracts;
    const contractName =
      Object.keys(contracts[path]).length > 0
        ? Object.keys(contracts[path])[0]
        : "";
    const abi = contracts[path][contractName].abi;
    return { name: contractName, abi };
  }

  async function createApprovalProcess(): Promise<ApprovalProcess | undefined> {
    const ap = globalState.form.approvalProcessToCreate;
    if (!ap) return;

    if (!globalState.form.network) {
      globalState.error = "Please select a network";
      return;
    }

    if (!ap.via || !ap.viaType) {
      globalState.error = "Please select an approval process";
      return;
    }

    log("[Defender Deploy] Creating deployment environment in Defender...");
    const apRequest: CreateApprovalProcessRequest = {
      name: `Deploy From Remix - ${ap.viaType}`,
      via: ap.via,
      viaType: ap.viaType,
      network: globalState.form.network,
      relayerId: ap.relayerId,
      component: ["deploy"],
    };
    const result: APIResponse<{ approvalProcess: ApprovalProcess }> =
      await API.createApprovalProcess(apRequest);

    if (!result.success) {
      globalState.error = result.error;
      deploying = false;

      // log error in Remix terminal
      logError(
        `[Defender Deploy] Approval process creation failed, error: ${JSON.stringify(result.error)}`,
      );
      return;
    }

    return result.data?.approvalProcess;
  }

  async function triggerDeployment() {
    if (!globalState.form.network || !contractName || !contractPath) return;

    deploying = true;

    const [constructorBytecode, error] = await attempt<string>(async () => {
      const abiCoder = new AbiCoder();
      return abiCoder.encode(
        inputs.map((input) => input.type),
        inputs.map((input) => inputsWithValue[input.name]),
      );
    });
    if (error) {
      logError(
        `[Defender Deploy] Error encoding constructor arguments: ${error.msg}`,
      );
      deploying = false;
      return;
    }

    const shouldUseInjectedProvider =
      globalState.form.approvalType === "injected";
    let contractAddress: string | undefined;
    let hash: string | undefined;
    if (shouldUseInjectedProvider) {
      log("[Defender Deploy] Switching network.");
      // ensures current network matches with the one selected.
      const [, error] = await attempt(async () =>
        switchToNetwork(globalState.form.network!),
      );
      if (error) {
        logError(`[Defender Deploy] Error switching network: ${error.msg}`);
        deploying = false;
        return;
      }

      if (!contractBytecode) {
        logError("[Defender Deploy] Contract bytecode not found.");
        deploying = false;
        return;
      }

      // contract deployment requires contract bytecode
      // and constructor bytecode to be concatenated.
      const bytecode = contractBytecode + constructorBytecode?.slice(2);

      log("[Defender Deploy] deploying contract...");
      const [result, err] = await attempt(async () => deployContract(bytecode));
      if (err) {
        logError(`[Defender Deploy] Error deploying contract: ${err.msg}`);
        deploying = false;
        return;
      }

      logSuccess(
        `[Defender Deploy] Contract deployed, tx hash: ${result?.hash}`,
      );

      contractAddress = result?.address;
      hash = result?.hash;

      // loads global state with EOA approval process to create
      globalState.form.approvalProcessToCreate = {
        viaType: "EOA",
        via: result?.sender,
      };
      globalState.form.approvalProcessSelected = undefined;
    }

    const selectedApprovalProcess = globalState.form.approvalProcessSelected;
    const approvalProcess: ApprovalProcess | undefined =
      selectedApprovalProcess ?? (await createApprovalProcess());
    if (!approvalProcess) {
      deploying = false;
      logError("[Defender Deploy] No Approval Process selected");
      return;
    };

    log("[Defender Deploy] Creating contract deployment in Defender...");
    const deployRequest: DeployContractRequest = {
      contractName: contractName,
      network: globalState.form.network,
      approvalProcessId: approvalProcess.approvalProcessId,
      contractPath: contractPath,
      verifySourceCode: true,
      artifactPayload: artifactPayload,
      constructorBytecode: constructorBytecode,
      salt,
    };
    const result: APIResponse<{ deployment: { deploymentId: string } }> =
      await API.createDeployment(deployRequest);
    if (!result.success || !result.data) {
      logError(
        `[Defender Deploy] Contract deployment creation failed, error: ${JSON.stringify(result.error)}`,
      );
      globalState.error = result.error;
      deploying = false;
      return;
    }

    deploymentId = result.data.deployment.deploymentId;

    if (shouldUseInjectedProvider) {
      if (!contractAddress || !hash) {
        logError("[Defender Deploy] Missing contract address or hash.");
        deploying = false;
        return;
      }
      const updateDeployRequest: UpdateDeploymentRequest = {
        deploymentId,
        hash: hash,
        address: contractAddress,
      };
      const res: APIResponse<null> =
        await API.updateDeployment(updateDeployRequest);
      if (!res.success) {
        // log error in Remix terminal
        logError(
          `[Defender Deploy] Failed to update deployment to deployed state: ${JSON.stringify(result.error)}`,
        );
        deploying = false;
        return;
      }
    }

    logSuccess("[Defender Deploy] Deployment submitted to Defender!");
    globalState.form.completed = true;
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
      checked={isDeterministic} 
      onchange={() => (isDeterministic = !isDeterministic)}
    >
    <label class="form-check-label" for="isDeterministic">
      Deterministic
    </label>
  </div>
</div>


{#if isDeterministic}
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
      Contract deployment submitted to Defender!<br>
      <a class="text-success" href={`https://defender.openzeppelin.com/#/deploy/environment/test?deploymentId=${deploymentId}`} target="_blank">
        View Deployment
      </a>
    </small>
  </p>
</div>
{/if}

<style>
  input[type=checkbox] {
    top: 2px;
  }
</style>
