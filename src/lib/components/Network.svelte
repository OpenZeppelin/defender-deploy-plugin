<script lang="ts">
  import {
    chainDisplayNames,
    type TenantNetworkResponse,
  } from "$lib/models/network";
  import type { DropdownItem } from "$lib/models/ui";
  import { globalState } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";

  type Props = {
    onSelected: (network: string) => void;
  };
  const { onSelected }: Props = $props();

  const networkToDropdownItem = (network: string | TenantNetworkResponse) => {
    const n = typeof network === "string" ? network : network.name;
    return { label: chainDisplayNames[n] ?? n, value: network };
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

    onSelected(network);
  };
</script>

<Dropdown
  items={globalState.networks
    .map(networkToDropdownItem)
    .sort((a, b) => (a.label > b.label ? 1 : -1))}
  placeholder="Select Network"
  on:select={(e) => onNetworkSelect(e.detail)}
/>
