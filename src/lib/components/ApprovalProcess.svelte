<script lang="ts">
  import { globalState } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";
  import {
    approvalProcessTypes,
    type ApprovalProcess,
    type ApprovalProcessType,
    type Relayer,
  } from "$lib/models/defender";
  import type { DropdownItem, GlobalState } from "$lib/models/utils";
    import { terminal } from "$lib/remix";
    import { abbreviateAddress } from "$lib/utils";

  // Approval processes load logic
  const toDisplayName = (ap: ApprovalProcess) => `${ap.name} (${ap.viaType})`;
  const approvalProcessToDropdownItem = (ap: ApprovalProcess) => ({
    label: toDisplayName(ap),
    value: ap,
  });

  const approvalProcessByNetworkAndComponent = (ap: DropdownItem) =>
    ap.value.network === globalState.form.network && ap.value.component?.includes('deploy');
  
  const approvalProcessByNetwork = (ap: DropdownItem) =>
    ap.value.network === globalState.form.network;

  // Approval process selection logic
  const onSelectApprovalProcess = (ap: DropdownItem) => {
    globalState.form.approvalProcessSelected = ap.value as ApprovalProcess;
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
        viaType: approvalProcessType as 'EOA' | 'Safe' | 'Relayer',
      };
    }
  };

  const relayerToDropdownItem = (relayer: Relayer) => ({
    label: `${relayer.name} (${abbreviateAddress(relayer.address)})`,
    value: relayer,
  });
  const onSelectRelayer = (relayer: DropdownItem) => {
    if (relayer.value) {
      globalState.form.approvalProcessToCreate = {
        viaType: 'Relayer',
        via: relayer.value.address,
        relayerId: relayer.value.relayerId,
      };
    }
  };

  const onAddressChange = (e: Event) => {
    const element = e.target as HTMLInputElement;
    if (element.value) {

      // Save the type to create the approval process.
      globalState.form.approvalProcessToCreate = {
        viaType: approvalProcessType as 'EOA' | 'Safe' | 'Relayer',
        via: element.value,
      };
    }
  };

  // Radio logic
  let radioSelected = $state<GlobalState['form']['approvalType']>("existing");
  const onRadioChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      radioSelected = target.id as GlobalState['form']['approvalType'];

      globalState.form.approvalType = radioSelected;
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

  {#key globalState.form.approvalProcessSelected}
    <Dropdown
      items={globalState.approvalProcesses
        .map(approvalProcessToDropdownItem)
        .filter(approvalProcessByNetworkAndComponent)}
      placeholder="Select Approval Process"
      on:select={(e) => onSelectApprovalProcess(e.detail)}
      disabled={radioSelected !== "existing"}
      defaultItem={globalState.form.approvalProcessSelected ? {
        label: toDisplayName(globalState.form.approvalProcessSelected),
        value: globalState.form.approvalProcessSelected,
      } : undefined}
      emptyLabel="No Approval Processes in selected Network"
    />
  {/key}
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
      disabled={radioSelected !== "new"}
    />
  {:else if approvalProcessType === "Relayer"}
    <label for="relayer" class="mb-0"> Relayer (required) </label>
    <Dropdown
      name="relayer"
      items={globalState.relayers.map(relayerToDropdownItem)}
      placeholder="* Select Relayer"
      on:select={(e) => onSelectRelayer(e.detail)}
      disabled={radioSelected !== "new"}
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
