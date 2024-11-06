<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { globalState } from "$lib/state/state.svelte";
  import Button from "./shared/Button.svelte";

  let loading = false;

  beforeNavigate(() => {
    loading = true;
  });

  afterNavigate(() => {
    loading = false;
  });
</script>

<form method="POST" action="?/authenticate">
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
  />

  <Button title="Save" {loading} />
</form>
