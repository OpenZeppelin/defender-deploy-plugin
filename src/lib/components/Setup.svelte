<script lang="ts">
  import { terminal } from "$lib/remix";
  import { globalState } from "$lib/state/state.svelte";
  import Button from "./shared/Button.svelte";

  let loading = $state(false);
	let apiKey = "";
	let apiSecret = "";

	const authenticate = async () => {
    loading = true;
    globalState.error = undefined;
  
    // Implementation in routes/auth.
		const response = await fetch("/auth", {
			method: "POST",
			headers: {	"Content-Type": "application/json" },
			body: JSON.stringify({ apiKey, apiSecret }),
		});
  
		const result: { success: boolean, error: string, data: any } = await response.json();

    if (!result.success) {
      globalState.error = result.error;
      loading = false;

      // log error in Remix terminal
      terminal?.log({ type: 'error', value: `[Defender Deploy] Authentication failed, error: ${JSON.stringify(result.error)}` });
      return;
    }

		if (result?.data?.credentials) {
			globalState.credentials = {
				apiKey: result?.data?.credentials.apiKey,
				apiSecret: result?.data?.credentials.apiSecret,
			};
			globalState.authenticated = true;
  
      // logs in Remix terminal.
      terminal?.log({ type: 'info', value: '[Defender Deploy] Defender Authentication was successful!' });
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

  <Button title="Save" {loading} onclick={authenticate}/>
</div>
