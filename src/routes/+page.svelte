<script>
  import { initPlugin } from "$lib";
  import { onMount } from "svelte";

  let { form } = $props();

  onMount(initPlugin);
</script>

<p>Deploy with Defender</p>

<form method="POST" action="?/authenticate">
	<label>
		Api Key
		<input name="apiKey">
	</label>
	<label>
		Api Secret
		<input name="apiSecret">
	</label>
	<button>Log in</button>
</form>

{#if form}
  <pre>{JSON.stringify(form, null, 2)}</pre>
{/if}