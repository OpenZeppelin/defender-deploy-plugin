<script lang="ts">
  import type { DropdownItem } from "$lib/models/ui";
  import { globalState } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";

  const networkToDropdownItem = (network: string) => ({
    label: network,
    value: network,
  });

  // network selection logic
  let network = $state("");
  const onNetworkSelect = (item: DropdownItem) => {
    network = item.value;
    globalState.form.network = network;
    globalState.form.approvalProcessSelected = undefined;
  };
</script>

<Dropdown
  items={globalState.networks.map(networkToDropdownItem)}
  placeholder="Select Network"
  on:select={(e) => onNetworkSelect(e.detail)}
/>
