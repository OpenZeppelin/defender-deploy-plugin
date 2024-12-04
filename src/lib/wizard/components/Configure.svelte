<script lang="ts">
  import { API } from "$lib/api";
  import { buildCompilerInput } from "$lib/models/solc";
  import { wizardState } from "../state.svelte";

  let result: any;

  async function compile() {
    if (!wizardState.sources) return;
    const result = await API.compile(buildCompilerInput(wizardState.sources));
    console.log(result);
  }

</script>

<p>
  Contract to compile: {wizardState.sources?.target}
  
  <button onclick={compile} >
    Compile
  </button>

  result: {JSON.stringify(result, null, 2)}
</p>
