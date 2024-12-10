<script lang="ts">
	import "../wizard-app.css";

  import { initWizardPlugin } from "$lib/wizard";
  import { onMount } from "svelte";
  import Configuration from "$lib/wizard/components/Configuration.svelte";
  import Network from "$lib/wizard/components/Network.svelte";
  import Button from "$lib/wizard/components/shared/Button.svelte";
  import { addAPToDropdown, globalState } from "$lib/state/state.svelte";
  import { API } from "$lib/api";
  import { buildCompilerInput, type ContractSources } from "$lib/models/solc";
  import Message from "$lib/wizard/components/shared/Message.svelte";
  import type { Artifact, DeployContractRequest, UpdateDeploymentRequest } from "$lib/models/deploy";
  import { getNetworkLiteral } from "$lib/models/network";
  import { attempt } from "$lib/utils/attempt";
  import { getContractBytecode } from "$lib/utils/contracts";
  import { deployContract, switchToNetwork } from "$lib/ethereum";
  import type { ApprovalProcess as ApprovalProcessType, CreateApprovalProcessRequest } from "$lib/models/approval-process";
  import type { APIResponse } from "$lib/models/ui";
  import { isDeploymentEnvironment, isSameNetwork } from "$lib/utils/helpers";
  import ApprovalProcess from "$lib/wizard/components/ApprovalProcess.svelte";

  interface DeploymentResult {
    deploymentId?: string;
    address: string;
    hash: string;
    sender?: string;
  }

  let busy = $state(false);
  let successMessage = $state<string>("");
  let errorMessage = $state<string>("");
  let compilationResult = $state<{ output: Artifact['output'] }>();
  let deploymentId = $state<string | undefined>(undefined);
  let deploymentArtifact = $derived.by(() => {
    if (!compilationResult || !globalState.contract?.target || !globalState.contract.source?.sources) return;
   
    return {
      input: buildCompilerInput(globalState.contract.source?.sources as ContractSources),
      output: compilationResult.output
    }
  });

  let contractBytecode = $derived.by(() => {
    if (!globalState.contract?.target || !compilationResult) return;

    const name = globalState.contract.target;
    const sources = compilationResult.output.contracts;

    return getContractBytecode(name, name, sources);
  });

  let constructorBytecode = $derived.by(() => {
    return "0x";
  });

  let deploymentResult = $state<DeploymentResult | undefined>(undefined);

  let currentStep = $state(0);
  function toggleStep(step: number) {
    currentStep = step;
  }

  const displayMessage = (message: string, type: "success" | "error") => {
    successMessage = "";
    errorMessage = "";
    if (type === "success") {
      successMessage = message;
    } else {
      errorMessage = message;
    }
  }
  async function compile() {
    const sources = globalState.contract?.source?.sources;
    if (!sources) {
      displayMessage("No source code found", "error");
      return;
    }

    const res = await API.compile(buildCompilerInput(
      globalState.contract!.source!.sources as ContractSources
    ));

    if (!res.success) {
      displayMessage("Compilation failed", "error");
      return;
    }

    displayMessage("Compilation successful", "success");
    compilationResult = res.data;
  }

  export async function handleInjectedProviderDeployment(bytecode: string) {
    // Switch network if needed
    const [, networkError] = await attempt(async () => switchToNetwork(globalState.form.network!));
    if (networkError) {
      throw new Error(`Error switching network: ${networkError.msg}`);
    }

    const [result, error] = await attempt(async () => deployContract(bytecode));
    if (error) {
      throw new Error(`Error deploying contract: ${error.msg}`);
    }

    if (!result) {
      throw new Error("Deployment result not found");
    }

    displayMessage(`Contract deployed successfully, hash: ${result?.hash}`, "success");
    
    return {
      address: result.address,
      hash: result.hash,
      sender: result.sender
    };
  }

  function findDeploymentEnvironment(via?: string, network?: string) {
    if (!via || !network) return undefined;
    return globalState.approvalProcesses.find((ap) => 
      ap.network &&
      isDeploymentEnvironment(ap) &&
      isSameNetwork(ap.network, network) &&
      ap.via?.toLocaleLowerCase() === via.toLocaleLowerCase()
    );
  }


  async function getOrCreateApprovalProcess(): Promise<ApprovalProcessType | undefined> {
    const ap = globalState.form.approvalProcessToCreate;
    if (!ap || !ap.via || !ap.viaType) {
      displayMessage("Must select an approval process to create", "error");
      return;
    }

    if (!globalState.form.network) {
      displayMessage("Must select a network", "error");
      return;
    }

    const existing = findDeploymentEnvironment(ap.via, ap.network);
    if (existing) {
      return existing;
    }

    const apRequest: CreateApprovalProcessRequest = {
      name: `Deploy From Remix - ${ap.viaType}`,
      via: ap.via,
      viaType: ap.viaType,
      network: getNetworkLiteral(globalState.form.network),
      relayerId: ap.relayerId,
      component: ["deploy"],
    };
    const result: APIResponse<{ approvalProcess: ApprovalProcessType }> =
      await API.createApprovalProcess(apRequest);

    if (!result.success) {
      displayMessage(`Approval process creation failed, error: ${JSON.stringify(result.error)}`, "error");
      return;
    }

    displayMessage("Deployment Environment successfully created", "success");
    if (!result.data) return;

    addAPToDropdown(result.data.approvalProcess)
    return result.data.approvalProcess;
  }

  export async function createDefenderDeployment(request: DeployContractRequest) {
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

  // function listenForDeployment(deploymentId: string) {
  //   // polls the deployment status every 10 seconds
  //   const interval = 10000;
  //   timeout = setInterval(async () => {
  //     const result: APIResponse<{ address: string, hash: string }> = await API.getDeployment(deploymentId);
  //     if (result.success && result.data?.address) {
  //       deploymentResult = {
  //         address: result.data.address,
  //         hash: result.data.hash,
  //       };
  //       logDeploymentResult(deploymentResult);
  //       clearInterval(timeout);
  //     }
  //   }, interval);
  // }


  const deploy = async () => {
    if (!globalState.form.network) {
      displayMessage("No network selected", "error");
      return;
    }

    if (!globalState.contract?.target || !globalState.contract.source?.sources) {
      displayMessage("No contract selected", "error");
      return;
    }

    if (!deploymentArtifact) {
      displayMessage("No artifact found", "error");
      return;
    }

    // contract deployment requires contract bytecode
    // and constructor bytecode to be concatenated.
    const bytecode = contractBytecode + constructorBytecode?.slice(2);

    const shouldUseInjectedProvider = globalState.form.approvalType === "injected";
    if (shouldUseInjectedProvider) {
      const [result, error] = await attempt(async () =>
        handleInjectedProviderDeployment(bytecode),
      );
      if (error) {
        displayMessage(`Error deploying contract: ${error.msg}`, "error");
        return;
      }

      deploymentResult = result;

      // loads global state with EOA approval process to create
      globalState.form.approvalProcessToCreate = {
        viaType: "EOA",
        via: deploymentResult?.sender,
        network: getNetworkLiteral(globalState.form.network),
      };
      globalState.form.approvalProcessSelected = undefined;
    }

    const approvalProcess = globalState.form.approvalProcessSelected ?? await getOrCreateApprovalProcess();
    if (!approvalProcess) {
      displayMessage("No Approval Process selected", "error");
      return;
    };

    const deployRequest: DeployContractRequest = {
      network: getNetworkLiteral(globalState.form.network),
      approvalProcessId: approvalProcess.approvalProcessId,
      contractName: globalState.contract!.target,
      contractPath:  globalState.contract!.target,
      verifySourceCode: true,
      licenseType: 'MIT',
      artifactPayload: JSON.stringify(deploymentArtifact),
      // TODO: Implement constructor arguments + salt
      constructorBytecode: '',
      salt: '',
    }

    const [newDeploymentId, deployError] = await attempt(async () => createDefenderDeployment(deployRequest));
    if (deployError || !newDeploymentId) {
      displayMessage(`Deployment failed to create: ${deployError?.msg}`, "error");
      return;
    }

    if (shouldUseInjectedProvider && deploymentResult) {
      const [, updateError] = await attempt(async () => updateDeploymentStatus(
        newDeploymentId,
        deploymentResult!.address,
        deploymentResult!.hash
      ));
      if (updateError) {
        displayMessage(`Error updating deployment status: ${updateError.msg}`, "error");
        return;
      }
    } else {
      // If we're not using an injected provider
      // we need to listen for the deployment to be finished.
      // listenForDeployment(newDeploymentId);
    }

    deploymentId = newDeploymentId;
    displayMessage("Deployment successful", "success");
  };

  async function compileAndDeploy() {
    busy = true;
    await compile();
    await deploy();
    busy = false;
  }

  onMount(initWizardPlugin);
</script>


<div class="h-[calc(100vh-2rem)] flex flex-col pt-2">
  <div class="flex-1 overflow-y-auto">
    <button onclick={() => toggleStep(0)} class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3" >
      <h1>Configuration</h1>
      <i class={`pr-2 ${currentStep === 0 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!(currentStep === 0)}>
      <div class="pl-4 pr-4"> 
        <Configuration />
      </div>
    </div>
    <button disabled={!globalState.authenticated} onclick={() => toggleStep(1)} class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3">
      <h1>Network</h1>
      <i class={`pr-2 ${currentStep === 1 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!(currentStep === 1)} >
      <div class="pl-4 pr-4"> 
        <Network onSelected={() => {}} />
      </div>
    </div>
    <button disabled={!globalState.authenticated} onclick={() => toggleStep(2)} class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3">
      <h1>Approval Process</h1>
      <i class={`pr-2 ${currentStep === 2 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!(currentStep === 2)}>
      <div class="pl-4 pr-4"> 
        <ApprovalProcess  />
      </div>
    </div>
  </div>
  <div class="sticky px-4 flex flex-col gap-2">
    <Button disabled={!globalState.authenticated || busy} loading={busy} label="Deploy" onClick={compileAndDeploy} />

    {#if successMessage || errorMessage} 
      <Message message={successMessage || errorMessage} type={successMessage ? "success" : "error"} />
    {/if}
  </div>
</div>
<style>
  h1 {
    margin-top: 0;
    margin-bottom: 0;
    text-transform: lowercase;
    font-variant: small-caps;
    font-size: 14px;
    color: rgb(129, 137, 152);
    font-weight: 600;
  }
  </style>