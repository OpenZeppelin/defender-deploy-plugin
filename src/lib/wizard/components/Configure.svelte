<script lang="ts">
  import { API } from "$lib/api";
  import { buildCompilerInput, type ContractSources } from "$lib/models/solc";
  import { wizardState } from "../state.svelte";

  let compilationResult: any;

  async function compile() {
    if (!wizardState.sources) return;
    compilationResult = await API.compile(buildCompilerInput(wizardState.sources));
  }

  function getMainContractName(sources?: ContractSources) {
    if (!sources) return '';
    // The first name that is not a dependency
    return Object.keys(sources).find(name => !name.startsWith('@'));
  }

</script>

<p>
  Contract to compile: {getMainContractName(wizardState.sources)}
  
  <button onclick={compile} >
    Compile
  </button>
</p>
