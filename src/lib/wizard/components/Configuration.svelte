<script lang="ts">
  import { API } from "$lib/api";
  import type { AuthenticationResponse } from "$lib/models/auth";
  import type { APIResponse } from "$lib/models/ui";
  import { globalState } from "$lib/state/state.svelte";
  
  // import { buildCompilerInput, type ContractSources } from "$lib/models/solc";
  // let compilationResult: any;

  // async function compile() {
  //   if (!wizardState.sources) return;
  //   compilationResult = await API.compile(buildCompilerInput(wizardState.sources));
  // }

  let loading = $state(false);
  let successMessage = $state<string | undefined>(undefined);
  let errorMessage = $state<string | undefined>(undefined);
  let apiKey = $state("");
  let apiSecret = $state("");

  function handleGetApiKey() {
    // TODO: Implement
  }

  async function authenticate() {

    loading = true;

    const result: APIResponse<AuthenticationResponse> = await API.authenticate({ apiKey, apiSecret });

if (result.success) {
  globalState.authenticated = true;
  successMessage = "API Key Authenticated";
} else {
  errorMessage = result.error ?? "Defender Authentication Failed";
}

if (result?.data?.credentials) {
  globalState.credentials = {
    apiKey: result?.data?.credentials.apiKey,
    apiSecret: result?.data?.credentials.apiSecret,
  };
}

if (result?.data?.permissions) {
  globalState.permissions = result?.data?.permissions;
}

if (result?.data?.networks) {
  globalState.networks = result?.data?.networks;
}

if (result?.data?.approvalProcesses) {
  globalState.approvalProcesses = result?.data?.approvalProcesses;
}

if (result?.data?.relayers) {
  globalState.relayers = result?.data?.relayers;
}

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
  <input name="apiKey" type="text" bind:value={apiKey} placeholder="Enter your API key" class="border border-gray-300 rounded-md p-2" />

  <label class="text-sm" for="apiSecret">Secret</label>
  <input name="apiSecret" type="password" bind:value={apiSecret} placeholder="Enter your API secret" class="border border-gray-300 rounded-md p-2" />

  <button onclick={authenticate} disabled={loading} class="bg-blue-600 text-white text-sm rounded-md p-2 mt-2" class:bg-gray-400={loading}>
    {#if loading}
      <i class="fa fa-spinner fa-spin"></i>
    {/if}
    {#if !loading}
      Authenticate
    {/if}
  </button>

  {#if successMessage}
    <div class="text-green-600">{successMessage}</div>
  {/if}

  {#if errorMessage}
    <div class="text-red-600">{errorMessage}</div>
  {/if}
</div>
