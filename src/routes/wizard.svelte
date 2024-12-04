<script lang="ts">
	import "../wizard-app.css";

  import { initWizardPlugin } from "$lib/wizard";
  import { onMount } from "svelte";
  import Configuration from "$lib/wizard/components/Configuration.svelte";
  import Network from "$lib/wizard/components/Network.svelte";

  let currentStep = $state(0);
  function toggleStep(step: number) {
    currentStep = step;
  }

  onMount(initWizardPlugin);
</script>

<div class="pt-2">
  <h3>
    <button onclick={() => toggleStep(0)} class="flex items-center justify-between w-full p-4 font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3" >
      <span>Configuration</span>
      <i class={`pr-2 ${currentStep === 0 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
  </h3>
  <div class:hidden={!(currentStep === 0)}>
    <div class="pl-4 pr-4"> 
      <Configuration />
    </div>
  </div>
  <h3>
    <button onclick={() => toggleStep(1)} class="flex items-center justify-between w-full p-4 font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3">
      <span>Network</span>
      <i class={`pr-2 ${currentStep === 1 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
  </h3>
  <div class:hidden={!(currentStep === 1)} >
    <div class="pl-4 pr-4"> 
      <Network />
    </div>
  </div>
  <h3>
    <button onclick={() => toggleStep(2)} class="flex items-center justify-between w-full p-4 font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3">
      <span>Approval Process</span>
      <i class={`pr-2 ${currentStep === 2 ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
  </h3>
  <div class:hidden={!(currentStep === 2)}>
    <div class="pl-4 pr-4"> 
      Select approval process
    </div>
  </div>
</div>
