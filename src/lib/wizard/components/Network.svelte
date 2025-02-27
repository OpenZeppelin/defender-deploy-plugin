<script lang="ts">
  import {
    chainDisplayNames,
    isProductionNetwork,
    type TenantNetworkResponse,
  } from "$lib/models/network";
  import type { DropdownItem } from "$lib/models/ui";
  import { globalState, setApprovalProcessToCreate, setNetwork, setSelectedApprovalProcess, setSelectedApprovalProcessType, updateSelectedApprovalProcessWithExisting } from "$lib/state/state.svelte";
  import { approvalProcessByNetworkAndComponent } from "../../models/approval-process";
  import Dropdown from "./shared/Dropdown.svelte";

  type Props = {
    onSelected: (network: string | TenantNetworkResponse) => void;
  };
  const { onSelected }: Props = $props();

  const getNetworkGroup = (network: string | TenantNetworkResponse) => {
    const type = typeof network !== "string" ? network.networkType : undefined;
    if (type === 'fork') return 'Forked Networks';
    if (type === 'private') return 'Private Networks';

    const isProduction = isProductionNetwork(network);
    return isProduction ? 'Production Networks' : 'Test Networks';
  };

  const networkToDropdownItem = (network: string | TenantNetworkResponse) => {
    const n = typeof network === "string" ? network : network.name;
    return { 
      label: chainDisplayNames[n] ?? n, 
      value: network, 
      group: getNetworkGroup(network),
    };
  };

  // network selection logic
  const onNetworkSelect = ({value: networkName}: DropdownItem<string | TenantNetworkResponse>) => {
    setNetwork(networkName);

    setSelectedApprovalProcess(undefined)
    setApprovalProcessToCreate(undefined);

    const approvalExistingApprovalProcess = globalState.approvalProcesses.find(approvalProcessByNetworkAndComponent(networkName))

    if(approvalExistingApprovalProcess) setSelectedApprovalProcessType("existing")
    else setSelectedApprovalProcessType("new")

    // Clear deployment status
    globalState.clearDeploymentStatus?.();

    onSelected(networkName);
  };
</script>

<Dropdown
  items={globalState.networks.map(networkToDropdownItem)}
  placeholder="Select Network"
  on:select={(e) => onNetworkSelect(e.detail)}
  defaultItem={globalState.form.network ? networkToDropdownItem(globalState.form.network) : undefined}
/>
