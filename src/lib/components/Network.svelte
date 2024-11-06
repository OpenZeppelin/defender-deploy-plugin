<script lang="ts">
  import { globalState } from "$lib/state/state.svelte";

  const { networks }: { networks: string[] } = $props();

  // network selection logic
  let network = $state("");
  const onNetworkSelect = (net: string) => {
    network = net;
    globalState.form.network = net;
  };
</script>

<div class="dropdown">
  <button
    class="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenuButton1"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    {network ? network : "Network"}
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    {#each networks as net}
      <button
        type="button"
        class="dropdown-item"
        onclick={() => onNetworkSelect(net)}
      >
        {net}
      </button>
    {/each}
  </div>
</div>
