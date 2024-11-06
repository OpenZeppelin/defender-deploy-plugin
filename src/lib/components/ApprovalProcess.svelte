<script lang="ts">
  import { globalState } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";
  import {
    approvalProcessTypes,
    type ApprovalProcess,
    type ApprovalProcessType,
  } from "$lib/models/defender";
  import type { DropdownItem } from "$lib/models/utils";
  import Button from "./shared/Button.svelte";

  const { approvalProcesses }: { approvalProcesses: ApprovalProcess[] } =
    $props();

  // Approval processes load logic
  const toDisplayName = (ap: ApprovalProcess) => `${ap.name} (${ap.network})`;
  const approvalProcessToDropdownItem = (ap: ApprovalProcess) => ({
    label: toDisplayName(ap),
    value: ap,
  });
  const approvalProcessByNetwork = (ap: DropdownItem) =>
    ap.value.network === globalState.form.network;

  // Approval process selection logic
  let approvalProcess = $state<ApprovalProcess>();
  const onSelectApprovalProcess = (ap: DropdownItem) => {
    approvalProcess = ap.value;
    globalState.form.approvalProcess = approvalProcess;
  };

  // Approval process creation logic
  const approvalProcessTypeToDropdownItem = (type: ApprovalProcessType) => ({
    label: type,
    value: type,
  });

  let approvalProcessType = $state<ApprovalProcessType>("EOA");
  const onSelectApprovalProcessType = (type: DropdownItem) => {
    if (type.value) {
      approvalProcessType = type.value;

      // Save the type to create the approval process.
      globalState.form.approvalProcessToCreate = {
        ...globalState.form.approvalProcessToCreate,
        viaType: approvalProcessType,
      };
    }
  };

  let approvalProcessAddress = $state<string>();
  const onAddressChange = (e: Event) => {
    const element = e.target as HTMLInputElement;
    if (element.value) {
      approvalProcessAddress = element.value;

      console.log("new address", approvalProcessAddress);

      // Save the type to create the approval process.
      globalState.form.approvalProcessToCreate = {
        viaType: approvalProcessType,
        via: element.value,
      };
    }
  };

  // Radio logic
  let radioSelected = $state("existing");
  const onRadioChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      radioSelected = target.id;

      // Use injected provider when deploying.
      globalState.form.useInjectedProvider = radioSelected === "injected";
    }
  };
</script>

<div class="form-check">
  <input
    class="form-check-input"
    type="radio"
    name="flexRadioDefault"
    id="existing"
    onclick={(e) => onRadioChange(e)}
    checked
  />
  <label class="form-check-label" for="flexRadioDefault1">
    Use existing Approval Process
  </label>

  <Dropdown
    items={approvalProcesses
      .map(approvalProcessToDropdownItem)
      .filter(approvalProcessByNetwork)}
    placeholder="Select Approval Process"
    on:select={(e) => onSelectApprovalProcess(e.detail)}
    disabled={radioSelected !== "existing"}
    emptyLabel="No Approval Processes in selected Network"
  />
</div>
<div class="form-check">
  <input
    class="form-check-input"
    type="radio"
    name="flexRadioDefault"
    id="new"
    onclick={(e) => onRadioChange(e)}
  />
  <label class="form-check-label" for="flexRadioDefault2">
    Create new Approval Process
  </label>

  <Dropdown
    items={approvalProcessTypes.map(approvalProcessTypeToDropdownItem)}
    placeholder="Approval Process Type"
    on:select={(e) => onSelectApprovalProcessType(e.detail)}
    disabled={radioSelected !== "new"}
    defaultItem={{
      label: approvalProcessType,
      value: approvalProcessType,
    }}
  />

  {#if approvalProcessType === "EOA" || approvalProcessType === "Safe"}
    <label for="address"> Address (required) </label>
    <input
      id="address"
      type="text"
      class="form-control"
      name="address"
      placeholder="* Address"
      onchange={onAddressChange}
    />
  {/if}

  <Button title="Create" />
</div>
<div class="form-check">
  <input
    class="form-check-input"
    type="radio"
    name="flexRadioDefault"
    id="injected"
    onclick={(e) => onRadioChange(e)}
  />
  <label class="form-check-label" for="flexRadioDefault2">
    Approve using injected provider
  </label>
</div>
