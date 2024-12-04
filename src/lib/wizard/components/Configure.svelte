<script>
  import { API } from "$lib/api";
  import { wizardState } from "../state.svelte";

  async function compile() {
    // if (!wizardState.sources) return;
    // const result = await API.compile(wizardState.sources);
    // console.log(result);
  }

</script>

<p>
  Contract to compile: {wizardState.sources?.target}
  
  <button onclick={compile} >
    Compile
  </button>
</p>
