<script lang="ts">
  import { globalState, setApprovalProcessToCreate, setSelectedApprovalProcess, setSelectedApprovalProcessType } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";
  import { abbreviateAddress } from "$lib/utils/helpers";
  import {
  approvalProcessByNetworkAndComponent,
    approvalProcessTypes,
    type ApprovalProcess,
    type ApprovalProcessToCreate,
    type ApprovalProcessType,
  } from "$lib/models/approval-process";
  import { isSelectedApprovalProcessType, type DropdownItem, type HTMLInputElementEvent } from "$lib/models/ui";
  import type { Relayer } from "$lib/models/relayer";
  import { getNetworkLiteral } from "$lib/models/network";
  import Input from "./shared/Input.svelte";
  import Message from "./shared/Message.svelte";

  let address = $derived<string>(
    globalState.form.approvalProcessToCreate?.via || ""
  );

  // Approval processes load logic
  const toDisplayName = (ap: ApprovalProcess) => `${ap.name} (${ap.viaType})`;
  const approvalProcessToDropdownItem = (ap: ApprovalProcess) => ({
    label: toDisplayName(ap),
    value: ap,
  });

  // Approval process selection logic
  const onSelectApprovalProcess = ({value: selectedApprovalProcess}: DropdownItem<ApprovalProcess>) => {
    setSelectedApprovalProcess(selectedApprovalProcess);

    // Clear deployment status
    globalState.clearDeploymentStatus?.();
  };

  // Approval process creation logic
  const approvalProcessTypeToDropdownItem = (type: ApprovalProcessType) => ({
    label: type,
    value: type,
  });

  let approvalProcessType = $state<ApprovalProcessType>("EOA");
  const onSelectApprovalProcessType = (type: DropdownItem<ApprovalProcessToCreate["viaType"]>) => {
    if (type.value) {
      approvalProcessType = type.value;

      setApprovalProcessToCreate({
        ...globalState.form.approvalProcessToCreate,
        viaType: approvalProcessType,
      });
    }
  };

  // Relayer selection logic
  const relayerByNetwork = (relayer: Relayer) =>
    relayer.network === globalState.form.network?.name;
  const relayerToDropdownItem = (relayer: Relayer) => ({
    label: `${relayer.name} (${abbreviateAddress(relayer.address)})`,
    value: relayer,
  });
  const onSelectRelayer = (relayer: DropdownItem<{address: string, relayerId: string}>) => {
    if (relayer.value) {
      setApprovalProcessToCreate({
        viaType: "Relayer",
        via: relayer.value.address,
        relayerId: relayer.value.relayerId,
        network:
          globalState.form.network &&
          getNetworkLiteral(globalState.form.network),
      })
    }
  };

  const onAddressChange = (event: HTMLInputElementEvent) => {
    const viaAddress = event.currentTarget.value;

    setApprovalProcessToCreate({
      viaType: approvalProcessType ,
      via: viaAddress,
      network:
        globalState.form.network && getNetworkLiteral(globalState.form.network),
    })
  };

  // Radio logic
  let radioSelectedApprovalProcessType = $derived(globalState.form.approvalType);
  const onRadioChange = (event: HTMLInputElementEvent) => {
    const { id: selectedApprovalProcessType, checked } = event.currentTarget;

    if (checked && isSelectedApprovalProcessType(selectedApprovalProcessType)) {
      setSelectedApprovalProcessType(selectedApprovalProcessType)
    }
  };

  let approvalProcessExistForThisNetwork = $derived.by(() => globalState.approvalProcesses.some(approvalProcessByNetworkAndComponent(globalState.form.network)));

  let disableRelayers = $derived.by(
    () => !globalState.permissions?.includes("manage-relayers")
  );

</script>

<div class="form-check flex flex-col gap-2">
  <div>
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioDefault"
      id="existing"
      checked= {radioSelectedApprovalProcessType === "existing"}
      disabled={!approvalProcessExistForThisNetwork}
      onclick={(e) => onRadioChange(e)}
    />
    <label class="text-sm {approvalProcessExistForThisNetwork ? "" : "text-gray-500"}" for="flexRadioDefault1">
      Use existing Approval Process
    </label>
  </div>
  <div class="pl-4">
    {#key globalState.form.approvalProcessSelected}
      <Dropdown
        items={globalState.approvalProcesses
          .filter(approvalProcessByNetworkAndComponent(globalState.form.network))
          .map(approvalProcessToDropdownItem)}
        placeholder="Select Approval Process"
        on:select={(e) => onSelectApprovalProcess(e.detail)}
        disabled={radioSelectedApprovalProcessType !== "existing"}
        defaultItem={globalState.form.approvalProcessSelected
          ? {
              label: toDisplayName(globalState.form.approvalProcessSelected),
              value: globalState.form.approvalProcessSelected,
            }
          : undefined}
        emptyLabel="No Approval Processes Available"
      />
    {/key}
  </div>
</div>
<div
  class="form-check mt-3 flex flex-col gap-2"
  title={approvalProcessExistForThisNetwork ? "Deploy Environment already exists" : undefined}
>
  <div>
    <label
      class={`text-sm ${approvalProcessExistForThisNetwork ? "text-gray-500" : ""}`}
      for="flexRadioDefault2"
      title={approvalProcessExistForThisNetwork ? "Deploy Environment already exists" : undefined}
    >
      <input
        class="text-xs"
        type="radio"
        name="flexRadioDefault"
        id="new"
        checked= {radioSelectedApprovalProcessType === "new"}
        onclick={onRadioChange}
        disabled={approvalProcessExistForThisNetwork}
        title={approvalProcessExistForThisNetwork
          ? "Deploy Environment already exists"
          : undefined}
      />
      Create new Approval Process
    </label>
  </div>
  <div class="pl-4 gap-2 flex flex-col">
    <Dropdown
      items={approvalProcessTypes.map(approvalProcessTypeToDropdownItem)}
      placeholder="Approval Process Type"
      on:select={(e) => onSelectApprovalProcessType(e.detail)}
      disabled={radioSelectedApprovalProcessType !== "new" || approvalProcessExistForThisNetwork}
      defaultItem={{
        label: approvalProcessType,
        value: approvalProcessType,
      }}
    />

    {#if approvalProcessType === "EOA" || approvalProcessType === "Safe"}
      <div>
        <Input
          value={address}
          placeholder="* Address"
          type="text"
          onchange={onAddressChange}
        />
      </div>
    {:else if approvalProcessType === "Relayer"}
      {#if disableRelayers}
        <div class="mt-2">
          <Message
            message="API Key not allowed to manage Relayers"
            type="warn"
          />
        </div>
      {:else}
        <Dropdown
          name="relayer"
          items={globalState.relayers
            .filter(relayerByNetwork)
            .map(relayerToDropdownItem)}
          placeholder="* Select Relayer"
          on:select={(e) => onSelectRelayer(e.detail)}
          disabled={radioSelectedApprovalProcessType !== "new" || approvalProcessExistForThisNetwork}
        />
      {/if}
    {/if}
  </div>
</div>
<div class="form-check mt-3">
  <input
    class="form-check-input"
    type="radio"
    name="flexRadioDefault"
    id="injected"
    onclick={onRadioChange}
    title={approvalProcessExistForThisNetwork ? "Deploy Environment already exists" : undefined}
    disabled={approvalProcessExistForThisNetwork}
  />
  <label
    class={`text-sm ${approvalProcessExistForThisNetwork ? "text-gray-500" : ""}`}
    for="flexRadioDefault2"
    title={approvalProcessExistForThisNetwork ? "Deploy Environment already exists" : undefined}
  >
    Approve using injected provider
  </label>
  <div class="mt-2">
    <Message
      message="By selecting this option, the contract to deploy will not be verified automatically"
      type="warn"
    />
  </div>
</div>
