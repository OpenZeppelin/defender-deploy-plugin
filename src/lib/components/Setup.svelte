<script lang="ts">
  import { API } from "$lib/api";
  import type { AuthenticationResponse } from "$lib/models/auth";
  import type { APIResponse } from "$lib/models/ui";
  import { logError, logSuccess } from "$lib/remix/logger";
  import { globalState } from "$lib/state/state.svelte";
  import Button from "./shared/Button.svelte";

  type Props = {
    onSuccess: () => void;
  };

  const { onSuccess }: Props = $props();

  let loading = $state(false);
  let successMessage = $state<string | undefined>(undefined);
  let errorMessage = $state<string | undefined>(undefined);
  let apiKey = "";
  let apiSecret = "";

  const authenticate = async () => {
    loading = true;
    globalState.error = undefined;
    successMessage = undefined;
    errorMessage = undefined;

    const result: APIResponse<AuthenticationResponse> = await API.authenticate({ apiKey, apiSecret });

    if (result.success) {
      globalState.authenticated = true;
      logSuccess("[Defender Deploy] Defender Authentication was successful!");
      successMessage = "API Key Authenticated";
      onSuccess();
    } else {
      logError(`[Defender Deploy] Authentication failed, error: ${JSON.stringify(result.error)}`);
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

  {#if errorMessage}
    <div class="alert alert-danger d-flex align-items-center mt-2">
      <i class="fa fa-times-circle-o mr-2"></i>
      <p class="m-0 lh-1">
        <small class="lh-sm">{errorMessage}</small>
      </p>
    </div>
  {/if}

  {#if successMessage}
    <div class="alert alert-success d-flex align-items-center mt-2">
      <i class="fa fa-check-circle-o mr-2"></i>
      <p class="m-0">
        <small class="lh-sm">{successMessage}</small>
      </p>
    </div>
  {/if}

  <Button 
    title="Authenticate" 
    {loading} 
    loadingMessage={"Authenticating ..."} 
    onclick={authenticate} 
    disabled={globalState.authenticated}
  />
</div>
