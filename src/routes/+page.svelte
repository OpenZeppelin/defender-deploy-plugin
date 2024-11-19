<script lang="ts">
	import { initPlugin } from "$lib/remix";
	import { onMount } from "svelte";
	import { globalState } from "$lib/state/state.svelte";

	import Setup from "$lib/components/Setup.svelte";
	import Network from "$lib/components/Network.svelte";
	import ApprovalProcess from "$lib/components/ApprovalProcess.svelte";
	import Depoy from "$lib/components/Depoy.svelte";

	import { getAddress } from "ethers";
	import { attempt } from "$lib/utils";

	// Accordeon logic
	let currentTab = $state(0);
	const toggle = (tab: number) => (currentTab = tab);

	let isValidApprovalProcessStep = $derived.by(async () => {
		if (globalState.form.approvalType === "injected") {
			return true;
		}

		if (globalState.form.approvalType === 'existing' && globalState.form.approvalProcessSelected) {
			return true;
		}

		if (
			globalState.form.approvalType === 'new' &&
			globalState.form.approvalProcessToCreate?.viaType === "Relayer" &&
			globalState.form.approvalProcessToCreate?.relayerId
		) {
			return true;
		}

		if (
			globalState.form.approvalType === 'new' &&
			globalState.form.approvalProcessToCreate?.viaType !== "Relayer" &&
			globalState.form.approvalProcessToCreate?.via
		) {
			// check if address is valid
			const [checksumed, err] = await attempt(async () =>
				getAddress(globalState.form.approvalProcessToCreate!.via!),
			);
			if (err) {
				return false;
			}
			return true;
		}

		return false;
	});

	onMount(initPlugin);
</script>

<div class="container">
	<p>
		<small
			>To get started with <strong>Deploy With Defender</strong>, you need to
			have an
			<a href="https://defender.openzeppelin.com/" target="_blank"
				>OpenZeppelin Defender Account</a
			>
			(It's free) and setup an
			<a
				href="https://defender.openzeppelin.com/#/settings/api-keys"
				target="_blank"
			>
				API Key and Secret</a
			>.</small
		>
	</p>

	{#if globalState.error}
		<div class="alert alert-danger">
			<p><small>{globalState.error ?? ""}</small></p>
		</div>
	{/if}

	<div id="accordion">
		<div class="card">
			<button class="btn card-header" onclick={() => toggle(0)}>
				<h6 class="mb-0 accordeon-tab">
					<i
						class={`pr-2 ${currentTab === 0 ? "fa fa-angle-down" : "fa fa-angle-right"}`}
					></i>
					SETUP
				</h6>

				{#if globalState.authenticated}
					<i class="fa fa-check-circle-o text-success"></i>
				{/if}
			</button>

			<div class={`collapse ${currentTab === 0 ? "show" : ""}`}>
				<div class="card-body pt-0 pb-0">
					<Setup />
				</div>
			</div>
		</div>

		<div class="card">
			<button
				class="card-header btn"
				onclick={() => toggle(1)}
				disabled={!globalState.authenticated}
			>
				<h6 class="mb-0 accordeon-tab">
					<i
						class={`pr-2 ${currentTab === 1 ? "fa fa-angle-down" : "fa fa-angle-right"}`}
					></i>
					NETWORK
				</h6>

				{#if globalState.form.network}
					<i class="fa fa-check-circle-o text-success"></i>
				{/if}
			</button>

			<div class={`collapse ${currentTab === 1 ? "show" : ""}`}>
				<div class="card-body">
					<Network />
				</div>
			</div>
		</div>
		<div class="card">
			<button
				class="card-header btn"
				onclick={() => toggle(2)}
				disabled={!globalState.authenticated}
			>
				<h6 class="mb-0 accordeon-tab">
					<i
						class={`pr-2 ${currentTab === 2 ? "fa fa-angle-down" : "fa fa-angle-right"}`}
					></i>
					APPROVAL PROCESS
				</h6>

				{#await isValidApprovalProcessStep then isValid}
					{#if isValid}
						<i class="fa fa-check-circle-o text-success"></i>
					{/if}
				{/await}
			</button>
			<div class={`collapse ${currentTab === 2 ? "show" : ""}`}>
				<div class="card-body">
					<ApprovalProcess />
				</div>
			</div>
		</div>

		<div class="card">
			<button
				class="card-header btn"
				onclick={() => toggle(3)}
				disabled={!globalState.authenticated}
			>
				<h6 class="mb-0 accordeon-tab">
					<i
						class={`pr-2 ${currentTab === 3 ? "fa fa-angle-down" : "fa fa-angle-right"}`}
					></i>
					DEPLOY
				</h6>

				{#if globalState.form.completed}
					<i class="fa fa-check-circle-o text-success"></i>
				{/if}
			</button>
			<div class={`collapse ${currentTab === 3 ? "show" : ""}`}>
				<div class="card-body">
					<Depoy />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		cursor: pointer;
	}

	p {
		line-height: 1.2;
	}

	.accordeon-tab {
		color: #a2a3bd;
		display: flex;
		font-size: smaller;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
	}
</style>
