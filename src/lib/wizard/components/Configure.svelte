<script lang="ts">
  import { API } from "$lib/api";
  import { buildCompilerInput, type ContractSources } from "$lib/models/solc";
  import { wizardState } from "../state.svelte";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";

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
<div class="flex flex-col gap-2 space-y-4">
  <div class="space-y-2"><Input label="API Key" />
  <Input label="Secret" /></div>
  <Button label="Authorise" onClick={compile} />
</div>
