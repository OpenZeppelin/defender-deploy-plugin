<script lang="ts">
  import { API } from "$lib/api";
  import type { AuthenticationResponse } from "$lib/models/auth";
  import type { APIResponse } from "$lib/models/ui";
  import { globalState } from "$lib/state/state.svelte";
  import Button from "./shared/Button.svelte";
  import Input from "./shared/Input.svelte";

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
  <Input value={apiKey} placeholder="Enter your API key" type="text" />

  <Input label="Secret" value={apiSecret} placeholder="Enter your API secret" type="password" />

  <Button loading={loading} label="Authenticate" onClick={authenticate} />

  {#if successMessage}
    <div class="text-green-600">{successMessage}</div>
  {/if}

  {#if errorMessage}
    <div class="text-red-600">{errorMessage}</div>
  {/if}
</div>
