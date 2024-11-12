<script lang="ts">
  import { globalState } from "$lib/state/state.svelte";
  import type { ABIDescription, ABIParameter, CompilationResult } from "@remixproject/plugin-api";
  import Button from "./shared/Button.svelte";
  import type { ApprovalProcess, CreateApprovalProcessRequest, DeployContractRequest } from "$lib/models/defender";
  import { terminal } from "$lib/remix";

  let contractName: string | undefined;
  let contractAbi: string | undefined;
  let artifactPayload: string | undefined;
  let inputsWithValue: Record<string, string | number | boolean> = {};
  let contractPath: string | undefined;

  let deploying = $state(false);

  /**
   * Finds constructor arguments
   */
  const inputs = $derived.by(()  => {
    const path = globalState.contract?.target ?? '';
    const compilation = globalState.contract?.data;
    const contractSources = globalState.contract?.source?.sources;
    
    // if no compiled contracts found, then return empty inputs.
    if (!compilation || !path) return [];

    const { name, abi } = getContractFeatures(path, compilation);

    contractPath = path;
    contractName = name;
  
    contractAbi = JSON.stringify(abi);
    artifactPayload = JSON.stringify({
      input: {
        sources: {
          // weird typing in contract sources
          [path]: { content: (contractSources as any)[path].content },
        },
        settings: {
          // we don't actually need these settings, but they are required.
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      },
      output: {
        contracts: { ...compilation.contracts },
      },
    });

    const constructor = abi.find((fragment) => fragment.type === 'constructor');
    if (!constructor || !constructor.inputs) return [];
    return constructor.inputs as ABIParameter[];
  });

  function getContractFeatures(path: string, compilation: CompilationResult): { name: string, abi: ABIDescription[], libs?: Record<string, any> } {
    const contracts = compilation.contracts;
    const contractName = Object.keys(contracts[path]).length > 0 ? Object.keys(contracts[path])[0] : '';
    const abi = contracts[path][contractName].abi;
    return { name: contractName, abi };
  }

  async function createApprovalProcess(): Promise<ApprovalProcess | undefined>{
    const ap = globalState.form.approvalProcessToCreate;
    if (!ap) return;

    if (!globalState.form.network) {
      globalState.error = 'Please select a network';
      return;
    }

    if (!ap.via || !ap.viaType) {
      globalState.error = 'Please select an approval process';
      return;
    }

    const apRequest: CreateApprovalProcessRequest = {
      name: `Deploy From Remix - ${ap.viaType}`,
      via: ap.via,
      viaType: ap.viaType,
      network: globalState.form.network,
      relayerId: ap.relayerId,
      component: ['deploy'],
    };

    const createApprovalProcessResponse = await fetch("/approval-process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentials: globalState.credentials, approvalProcess: apRequest }),
    });

    const result: { 
      success: boolean, 
      error: string, 
      data: any 
    } = await createApprovalProcessResponse.json();
    if (!result.success) {
      globalState.error = result.error;

      // log error in Remix terminal
      terminal?.log({ type: 'error', value: `[Defender Deploy] Approval process creation failed, error: ${JSON.stringify(result.error)}` });
      return;
    }

    return result.data.approvalProcess;
  }

  async function triggerDeployment() {
    if (
      !globalState.form.network ||
      !contractName ||
      !contractPath
    ) return;

    deploying = true;
  
    const selectedApprovalProcess = globalState.form.approvalProcessSelected;
    const approvalProcess: ApprovalProcess | undefined = selectedApprovalProcess ?? await createApprovalProcess();
    if (!approvalProcess) return;

    const deployRequest: DeployContractRequest = {
      contractName: contractName,
      network: globalState.form.network,
      approvalProcessId: approvalProcess.approvalProcessId,
      contractPath: contractPath,
      verifySourceCode: true,
      artifactPayload: artifactPayload,
      constructorInputs: inputs.map((input) => inputsWithValue[input.name] ?? '0x0'),
    };

    terminal?.log({ type: 'log', value: '[Defender Deploy] Deploying contract...' });

    const createApprovalProcessResponse = await fetch("/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentials: globalState.credentials, deployment: deployRequest }),
    });

    const result: {
      success: boolean, 
      error: string, 
      data: any 
    } = await createApprovalProcessResponse.json();
    if (!result.success) {

      // log error in Remix terminal
      terminal?.log({ type: 'error', value: `[Defender Deploy] Contract deployment failed, error: ${JSON.stringify(result.error)}` });
      globalState.error = result.error;
      return;
    }

    terminal?.log({ type: 'info', value: '[Defender Deploy] Deployment submitted to Defender!' });
    deploying = false;
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    inputsWithValue[target.name] = target.value;
  }
</script>

<input 
  type="text"
  class="btn btn-secondary col form-control"
  value={globalState.contract?.target ?? 'Compile Contract'}
  disabled
/>

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

<Button title="Deploy" onclick={triggerDeployment} loading={deploying}/>