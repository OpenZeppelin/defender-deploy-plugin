<script lang="ts">
  import type { DropdownItem } from "$lib/models/utils";
  import { globalState } from "$lib/state/state.svelte";
  import Dropdown from "./shared/Dropdown.svelte";

  const { networks }: { networks: string[] } = $props();

  const networkToDropdownItem = (network: string) => ({
    label: network,
    value: network,
  });

  // network selection logic
  let network = $state("");
  const onNetworkSelect = (item: DropdownItem) => {
    network = item.value;
    globalState.form.network = network;
  };
</script>

<Dropdown
  items={networks.map(networkToDropdownItem)}
  placeholder="Select Network"
  on:select={(e) => onNetworkSelect(e.detail)}
/>
