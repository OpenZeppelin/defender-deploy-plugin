<script lang="ts">
  import { globalState } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";
  import {
    approvalProcessTypes,
    type ApprovalProcess,
    type ApprovalProcessType,
  } from "$lib/models/defender";
  import type { DropdownItem } from "$lib/models/utils";

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

  let approvalProcessType = $state<ApprovalProcessType>();
  const onSelectApprovalProcessType = (type: DropdownItem) => {
    approvalProcessType = type.value;
  };

  // Radio logic
  let radioSelected = $state("existing");
  const onRadioChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      radioSelected = target.id;
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
  />

  {#if approvalProcessType === "EOA" || approvalProcessType === "Safe"}
    <label for="address"> Address (required) </label>
    <input
      id="address"
      type="text"
      class="form-control"
      name="address"
      placeholder="* Address"
    />
  {/if}
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
