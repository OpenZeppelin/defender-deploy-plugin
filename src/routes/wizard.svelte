<script lang="ts">
	import "../wizard-app.css";
  import { initWizardPlugin } from "$lib/wizard";
  import { onMount } from "svelte";
  import Configuration from "$lib/wizard/components/Configuration.svelte";
  import Network from "$lib/wizard/components/Network.svelte";
  import { globalState,  isValidConstructorArguments,  isValidDeterministicConfiguration,  isValidFormApprovalProcess, isValidFormAuthentication, isValidFormNetwork } from "$lib/state/state.svelte";
  import ApprovalProcess from "$lib/wizard/components/ApprovalProcess.svelte";
  import Deploy from "$lib/wizard/components/Deploy.svelte";
  import StatusIcon from "../lib/wizard/components/shared/StatusIcon.svelte";

  const FormSteps = {
    authentication: "authentication",
    network: "network",
    approvalProcess: "approvalProcess",
    constructorArguments: "constructorArguments",
  } as const 

  let currentStep = $state<keyof typeof FormSteps>(FormSteps.authentication);
  const currentStepIsEndOfForm = currentStepIs(FormSteps.constructorArguments)

  function toggleStep(stepToToggle: keyof typeof FormSteps) {
    currentStep = stepToToggle;
  }
  function currentStepIs(stepToCheck: keyof typeof FormSteps) {
    return currentStep === stepToCheck;
  }

  onMount(initWizardPlugin);

  const getStateFormStatus = (
    stateForm: boolean
  ) => (stateForm ? "success" : "pending");

  let authenticationFilled = $derived.by(isValidFormAuthentication)
  let networkFormFilled = $derived.by(isValidFormNetwork)
  let approvalProcessFormFilledPromise = $derived.by(isValidFormApprovalProcess)
  let constructorArgumentsFilled = $derived.by(isValidConstructorArguments)
  let deterministicConfigurationFilled = $derived.by(isValidDeterministicConfiguration)

  $inspect(globalState.authenticated).with(async () => {
    if(authenticationFilled) toggleStep(FormSteps.network)
  });

  $inspect(globalState.form.network).with(async () => {
    if (networkFormFilled) toggleStep(FormSteps.approvalProcess)
  });

  $inspect(
    globalState.form.approvalProcessSelected, 
    globalState.form.approvalProcessToCreate
  ).with(async () => {
    if(currentStepIsEndOfForm) return

    if(await approvalProcessFormFilledPromise) toggleStep(FormSteps.constructorArguments)
  });
</script>

{JSON.stringify(globalState.form)}
<div class="h-[calc(100vh-2rem)] flex flex-col pt-2">
  <div class="flex-1 overflow-y-auto">
    <button onclick={() => toggleStep(FormSteps.authentication)} class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3" >
      <div class="flex items-center gap-3"> 
        <StatusIcon type={getStateFormStatus(authenticationFilled)} />
        <h1>Configuration</h1>
      </div>
      <i class={`pr-2 ${currentStepIs(FormSteps.authentication) ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!currentStepIs(FormSteps.authentication)}>
      <div class="pl-4 pr-4"> 
        <Configuration />
      </div>
    </div>
    <button 
      disabled={!authenticationFilled} 
      onclick={() => toggleStep(FormSteps.network)} 
      class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3" 
      class:cursor-not-allowed={!authenticationFilled}
      class:text-gray-300={!authenticationFilled}
    >
      <div class="flex items-center gap-3"> 
        <StatusIcon type={getStateFormStatus(networkFormFilled)} />
        <h1>Network</h1>
      </div>
      <i class={`pr-2 ${currentStepIs(FormSteps.network) ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
    <div class:hidden={!currentStepIs(FormSteps.network)} >
      <div class="pl-4 pr-4"> 
        <Network onSelected={() => {}} />
      </div>
    </div>
    {#await approvalProcessFormFilledPromise then approvalProcessFormFilled}
      <button
        disabled={!networkFormFilled} 
        onclick={() => toggleStep(FormSteps.approvalProcess)} 
        class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 rounded-t-xl gap-3"
        class:cursor-not-allowed={!networkFormFilled}
        class:text-gray-300={!networkFormFilled}
      >
        <div class="flex items-center gap-3"> 
          <StatusIcon
            type={getStateFormStatus(approvalProcessFormFilled)}
          />
          <h1>Approval Process</h1>
        </div>
        <i class={`pr-2 ${currentStepIs(FormSteps.approvalProcess) ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
      </button>
      <div class:hidden={!currentStepIs(FormSteps.approvalProcess)}>
        <div class="pl-4 pr-4"> 
          <ApprovalProcess  />
        </div>
      </div>
      <button
      disabled={!approvalProcessFormFilled} 
      onclick={() => toggleStep(FormSteps.constructorArguments)} 
      class="flex items-center justify-between w-full p-4 text-sm font-medium rtl:text-right text-gray-800 gap-3"
      class:cursor-not-allowed={!approvalProcessFormFilled}
      class:text-gray-300={!approvalProcessFormFilled}
      >
      <div class="flex items-center gap-3"> 
        <StatusIcon
          type={getStateFormStatus(
            constructorArgumentsFilled && deterministicConfigurationFilled && 
            currentStepIs(FormSteps.constructorArguments)
          )}
        />
        <h1>Deploy</h1>
      </div>
      <i class={`pr-2 ${currentStepIs(FormSteps.constructorArguments) ? "fa fa-angle-down" : "fa fa-angle-right"}`}></i>
    </button>
  {/await}
  <div class:hidden={!currentStepIs(FormSteps.constructorArguments)}>
    <div class="pl-4 pr-4"> 
      <Deploy />
    </div>
  </div>
  </div>
</div>
<style>
  button h1 {
    margin-top: 0;
    margin-bottom: 0;
    text-transform: lowercase;
    font-variant: small-caps;
    font-size: 14px;
    /* color: rgb(129, 137, 152); */
    font-weight: 600;
  }
  </style>