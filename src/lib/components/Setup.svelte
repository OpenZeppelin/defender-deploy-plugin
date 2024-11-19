<script lang="ts">
  import { API } from "$lib/api";
  import type { AuthenticationResponse } from "$lib/models/auth";
  import type { APIResponse } from "$lib/models/ui";
  import { logError, logSuccess } from "$lib/remix/logger";
  import { globalState } from "$lib/state/state.svelte";
  import Button from "./shared/Button.svelte";

  let loading = $state(false);
  let apiKey = "";
  let apiSecret = "";

  const authenticate = async () => {
    loading = true;
    globalState.error = undefined;

    const result: APIResponse<AuthenticationResponse> = await API.authenticate({ apiKey, apiSecret });

    if (!result.success) {
      logError(`[Defender Deploy] Authentication failed, error: ${JSON.stringify(result.error)}`);
      return;
    }

    globalState.authenticated = true;
    logSuccess("[Defender Deploy] Defender Authentication was successful!");

    if (result?.data?.credentials) {
      globalState.credentials = {
        apiKey: result?.data?.credentials.apiKey,
        apiSecret: result?.data?.credentials.apiSecret,
      };
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
  };
</script>

<div>
  <label for="apiKey">Api Key (required)</label>
  <input
    id="apiKey"
    type="text"
    class="form-control"
    name="apiKey"
    placeholder="* API Key"
    value={globalState.credentials.apiKey
      ? globalState.credentials.apiKey
      : undefined}
    onchange={(e) => (apiKey = (e.target as HTMLInputElement).value)}
  />

  <label for="apiSecret">Api Secret (required)</label>
  <input
    id="apiSecret"
    type="password"
    class="form-control"
    name="apiSecret"
    placeholder="* API Secret"
    value={globalState.credentials.apiSecret
      ? globalState.credentials.apiSecret
      : undefined}
    onchange={(e) => (apiSecret = (e.target as HTMLInputElement).value)}
  />

  <Button title="Save" {loading} onclick={authenticate} />
</div>
