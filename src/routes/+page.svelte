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

		const referrer = document.referrer; // Available through Wizard. Empty string through Remix.
		const ancestorOrigins = document.location.ancestorOrigins; // undefined on Firefox

		const parentUrl = ancestorOrigins?.[0] || referrer;

		if (dev) {
			// add desired behaviour for dev mode.
		}

		// in case we are developing locally, we want to use the wizard as the parent..
		if (parentUrl.includes("wizard") || parentUrl.includes("localhost")) {
			return parent = 'wizard';
		}

		// Remix on Firefox leads to empty parentUrl due to ancestorOrigins and referrer being unavailable.
		if (parentUrl.includes("remix.ethereum") || !parentUrl) {
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

