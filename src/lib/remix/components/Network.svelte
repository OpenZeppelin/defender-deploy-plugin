<script lang="ts">
  import {
    getNetworkDisplayName,
    isProductionNetwork,
    type NetworkResponse,
    type TenantNetworkResponse,
  } from "$lib/models/network";
  import type { DropdownItem } from "$lib/models/ui";
  import { globalState } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";

  type Props = {
    onSelected: (network: NetworkResponse | TenantNetworkResponse) => void;
  };
  const { onSelected }: Props = $props();

  const getNetworkGroup = (network: NetworkResponse | TenantNetworkResponse) => {
    const type = network.networkType

    if (type === 'fork') return 'Forked Networks';
    if (type === 'private') return 'Private Networks';

    const isProduction = isProductionNetwork(network);
    return isProduction ? 'Production Networks' : 'Test Networks';
  };

  const networkToDropdownItem = (network: NetworkResponse | TenantNetworkResponse) => {
 
    return { 
      label: getNetworkDisplayName(network), 
      value: network, 
      group: getNetworkGroup(network),
    };
  };

  // network selection logic
  let network = $state<NetworkResponse | TenantNetworkResponse>({
    name: "mainnet",
    displayName: "Mainnet",
    symbol: "ETH",
    chainId: 1,
    networkType: 'native',
    isProduction: true
  });

  const onNetworkSelect = (item: DropdownItem) => {
    network = item.value;
    globalState.form.network = network;

    // Resets Approval process state.
    globalState.form.approvalProcessSelected = undefined;
    globalState.form.approvalProcessToCreate = undefined;
    globalState.form.approvalType = "existing";

    onSelected(network);
  };
</script>

<Dropdown
  items={globalState.networks.map(networkToDropdownItem)}
  placeholder="Select Network"
  on:select={(e) => onNetworkSelect(e.detail)}
  defaultItem={globalState.form.network ? networkToDropdownItem(globalState.form.network) : undefined}
/>
