<script lang="ts">
  import {
    chainDisplayNames,
    isProductionNetwork,
    type TenantNetworkResponse,
  } from "$lib/models/network";
  import type { DropdownItem } from "$lib/models/ui";
  import { globalState, setDeploymentCompleted } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";

  type Props = {
    onSelected: (network: string) => void;
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
  let network = $state("");
  const onNetworkSelect = (item: DropdownItem) => {
    network = item.value;
    globalState.form.network = network;

    // Resets Approval process state.
    globalState.form.approvalProcessSelected = undefined;
    globalState.form.approvalProcessToCreate = undefined;
    globalState.form.approvalType = "existing";

    // Resets Deploy state.
    setDeploymentCompleted(false);

    onSelected(network);
  };
</script>

<Dropdown
  items={globalState.networks.map(networkToDropdownItem)}
  placeholder="Select Network"
  on:select={(e) => onNetworkSelect(e.detail)}
  defaultItem={globalState.form.network ? networkToDropdownItem(globalState.form.network) : undefined}
/>
