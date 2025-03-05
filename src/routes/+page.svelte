<script lang="ts">
	import { onMount } from "svelte";
	import { dev } from '$app/environment';

	import Wizard from "./wizard.svelte";
	import Remix from "./remix.svelte";

	let parent = $state<'remix' | 'wizard' | 'none'>();

	onMount(() => {
		const inIframe = window.location !== window.parent.location;

		if (!inIframe) {
			parent = 'none';
			return;
		}

		const ancestorOrigin = document.location.ancestorOrigins[0];

		if (dev) {
			// add desired behaviour for dev mode.
		}

		// in case we are developing locally, we want to use the wizard as the parent..
		if (ancestorOrigin.includes("wizard") || ancestorOrigin.includes("localhost")) {
			return parent = 'wizard';
		}

		if (ancestorOrigin.includes("remix.ethereum")) {
			return parent = 'remix';
		}

	});
</script>

<div class="container">
	{#if parent === 'none'}
		<p>⚠️ This page is meant to be embedded in an iframe! ⚠️</p>
	{/if}

	{#if parent === 'wizard'}
		<Wizard />
	{/if}

	{#if parent === 'remix'}
		<Remix />
	{/if}
</div>

