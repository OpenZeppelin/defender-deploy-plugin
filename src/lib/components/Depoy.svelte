<script lang="ts">
  import { globalState } from "$lib/state/state.svelte";
  import type { ABIParameter } from "@remixproject/plugin-api";
    import Button from "./shared/Button.svelte";

  /**
   * Finds constructor arguments
   */
  const inputs = $derived.by(()  => {
    const path = globalState.contract?.target ?? '';
    const contracts = globalState.contract?.data?.contracts;
    if (!contracts) return [];
    const contractName = Object.keys(contracts[path]).length > 0 ? Object.keys(contracts[path])[0] : '';
    const abi = contracts[path][contractName].abi;
    const constructor = abi.find((fragment) => fragment.type === 'constructor');
    if (!constructor || !constructor.inputs) return [];
    return constructor.inputs as ABIParameter[];
  });
</script>

<input 
  type="text"
  class="btn btn-secondary col form-control"
  value={globalState.contract?.target ?? 'Compile Contract'}
  disabled
/>

{#each inputs as input}
  <label for="apiSecret">{`${input.name} (${input.type})`}</label>
  <input 
    name={input.name}
    type="text"
    class="form-control"
    placeholder={input.name}
  />
{/each}

<Button title="Deploy" />