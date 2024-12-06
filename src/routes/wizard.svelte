<script lang="ts">
	import "../wizard-app.css";

  import { initWizardPlugin } from "$lib/wizard";
  import { onMount } from "svelte";
  import Configuration from "$lib/wizard/components/Configuration.svelte";
  import Network from "$lib/wizard/components/Network.svelte";
  import ApprovalProcess from "$lib/wizard/components/ApprovalProcess.svelte";
  import Button from "$lib/wizard/components/shared/Button.svelte";
  import { globalState } from "$lib/state/state.svelte";
  import { API } from "$lib/api";
  import { buildCompilerInput, type ContractSources } from "$lib/models/solc";
  import Message from "$lib/wizard/components/shared/Message.svelte";

  let busy = $state(false);
  let successMessage = $state<string>("");
  let errorMessage = $state<string>("");
  let compilationResult = $state<any>();

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


  const deploy = async () => {
    // TODO: Implement deploy
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
      <span>Configuration</span>
      <i class={`pr-2 ${currentStep === 0 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!(currentStep === 0)}>
      <div class="pl-4 pr-4"> 
        <Configuration />
      </div>
    </div>
    <button disabled={!globalState.authenticated} onclick={() => toggleStep(1)} class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3">
      <span>Network</span>
      <i class={`pr-2 ${currentStep === 1 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!(currentStep === 1)} >
      <div class="pl-4 pr-4"> 
        <Network onSelected={() => {}} />
      </div>
    </div>
    <button disabled={!globalState.authenticated} onclick={() => toggleStep(2)} class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3">
      <span>Approval Process</span>
      <i class={`pr-2 ${currentStep === 2 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!(currentStep === 2)}>
      <div class="pl-4 pr-4"> 
        <ApprovalProcess  />
      </div>
    </div>
    {#if compilationResult}
      {JSON.stringify(compilationResult, null, 2)}
    {/if}
  </div>
  <div class="sticky px-4 flex flex-col gap-2">
    <Button disabled={!globalState.authenticated || busy} loading={busy} label="Deploy" onClick={compileAndDeploy} />

    {#if successMessage || errorMessage} 
      <Message message={successMessage || errorMessage} type={successMessage ? "success" : "error"} />
    {/if}
  </div>
</div>
