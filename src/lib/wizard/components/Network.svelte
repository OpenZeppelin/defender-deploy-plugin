<script lang="ts">
  import {
    chainDisplayNames,
    chainIds,
    isProductionNetwork,
    type TenantNetworkResponse,
  } from "$lib/models/network";
  import type { DropdownItem } from "$lib/models/ui";
  import { globalState, setApprovalProcessToCreate, setNetwork, setSelectedApprovalProcess, setSelectedApprovalProcessType, updateSelectedApprovalProcessWithExisting } from "$lib/state/state.svelte";
  import { approvalProcessByNetworkAndComponent } from "../../models/approval-process";
  import Dropdown from "./shared/Dropdown.svelte";
  import SuperchainRegistry from "$lib/generated/superchainRegistryChainList.json";

  type Props = {
    onSelected: (network: string | TenantNetworkResponse) => void;
  };
  const { onSelected }: Props = $props();

  const superchainChainIds: number[] = SuperchainRegistry.map((chain) => chain.chainId);

  function isSuperchainNetwork(network: string | TenantNetworkResponse) {
    if (typeof network === "string") {
      return superchainChainIds.includes(chainIds[network]);
    } else {
      return superchainChainIds.includes(network.chainId);
    }
  }

  function formatGroupLabel(isProduction: boolean, isSuperchain: boolean, groupNetworksBy?: string) {
    let group = isProduction ? 'Production Networks' : 'Test Networks';
    if (groupNetworksBy === 'superchain') {
      group = `${group} (${isSuperchain ? 'Superchain' : 'Non-Superchain'})`;
    }
    return group;
  }

  const getNetworkGroup = (network: string | TenantNetworkResponse) => {
    const type = typeof network !== "string" ? network.networkType : undefined;
    if (type === 'fork') return 'Forked Networks';
    if (type === 'private') return 'Private Networks';

    return formatGroupLabel(
      isProductionNetwork(network),
      isSuperchainNetwork(network),
      globalState.contract?.groupNetworksBy
    );
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

    setSelectedApprovalProcess(undefined);
    setApprovalProcessToCreate(undefined);

    const approvalExistingApprovalProcess = globalState.approvalProcesses.find(approvalProcessByNetworkAndComponent(networkName));

    if (approvalExistingApprovalProcess) setSelectedApprovalProcessType("existing");
    else setSelectedApprovalProcessType("new");

    // Clear deployment status
    globalState.clearDeploymentStatus?.();

    onSelected(networkName);
  };

  // default priority is 0, numbers towards negative infinity are ordered first
  const groupPriorities = {
    'Production Networks (Superchain)': -2,
    'Test Networks (Superchain)': -1,
  };
</script>

<Dropdown
  items={globalState.networks.map(networkToDropdownItem)}
  placeholder="Select Network"
  on:select={(e) => onNetworkSelect(e.detail)}
  defaultItem={globalState.form.network ? networkToDropdownItem(globalState.form.network) : undefined}
  groupPriority={groupPriorities}
/>
