<script lang="ts">
  import { API } from "$lib/api";
  import { wizardState } from "../state.svelte";
  
  // import { buildCompilerInput, type ContractSources } from "$lib/models/solc";
  // let compilationResult: any;

  // async function compile() {
  //   if (!wizardState.sources) return;
  //   compilationResult = await API.compile(buildCompilerInput(wizardState.sources));
  // }

  // function getMainContractName(sources?: ContractSources) {
  //   if (!sources) return '';
  //   // The first name that is not a dependency
  //   return Object.keys(sources).find(name => !name.startsWith('@'));
  // }

  let loading = $state(false);

  function handleGetApiKey() {
  }

  async function authenticate() {
    if (!wizardState.apiKey || !wizardState.apiSecret) return;

    loading = true;

    await API.authenticate({ 
      apiKey: wizardState.apiKey, 
      apiSecret: wizardState.apiSecret 
    });

    loading = false;
  }

</script>

<div class="flex flex-col gap-2">
  <div class="flex flex-row justify-between">
    <div>
      <label class="text-sm" for="apiKey">API Key</label>
      <i class="fa fa-info-circle text-xs text-gray-500" title="Get your API key from the Defender Dashboard"></i>
    </div>
    <button onclick={handleGetApiKey} class="text-xs text-blue-600 font-bold">Get API Key</button>
  </div>
  <input name="apiKey" type="text" bind:value={wizardState.apiKey} placeholder="Enter your API key" class="border border-gray-300 rounded-md p-2" />

  <label class="text-sm" for="apiSecret">Secret</label>
  <input name="apiSecret" type="password" bind:value={wizardState.apiSecret} placeholder="Enter your API secret" class="border border-gray-300 rounded-md p-2" />

  <button onclick={authenticate} disabled={loading} class="bg-blue-600 text-white text-sm rounded-md p-2 mt-2">Authenticate</button>
</div>
