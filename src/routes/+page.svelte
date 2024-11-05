<script lang="ts">
  import { initPlugin } from "$lib";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

	// Components
	import Setup from "../components/Setup.svelte";
	import Network from "../components/Network.svelte";
	import ApprovalProcess from "../components/ApprovalProcess.svelte";
	import Depoy from "../components/Depoy.svelte";
	
	// Setup form logic
  let { form } = $props();
	const isSetupValid = $state(form?.success ?? false);

	// load resources
	const networkStore = writable({ networks: form?.data?.networks });
	const approvalProcessStore = writable({ approvalProcesses: form?.data?.approvalProcesses });
	$effect(() => {
		if (form?.data?.networks) {
			networkStore.set({ networks: form?.data?.networks});
			setContext('networks', networkStore);
		}

		if (form?.data?.approvalProcesses) {
			approvalProcessStore.set({ approvalProcesses: form?.data?.approvalProcesses});
			setContext('approvalProcess', approvalProcessStore);
		}
	});

	// Accordeon logic
	let currentTab = $state(0);
	const toggle = (tab: number) => currentTab = tab;

  onMount(initPlugin);
</script>

<div class="container">
	<p><small>To get started with <strong>Deploy With Defender</strong>, you need to have an 
		<a href="https://defender.openzeppelin.com/" target="_blank">OpenZeppelin Defender Account</a> 
		(I'ts free) and setup an <a href="https://defender.openzeppelin.com/#/settings/api-keys" target="_blank">
			API Key and Secret</a>.</small></p>
	
	<div id="accordion">
		<div class="card">
			<button class="btn card-header" onclick={() => toggle(0)}>
				<h6 class="mb-0 accordeon-tab">
					<i class={`pr-2 ${currentTab === 0 ? 'fa fa-angle-down' : 'fa fa-angle-right'}`} ></i>	
					SETUP
				</h6>
			</button>
	
			<div class={`collapse ${currentTab === 0 ? 'show': ''}`}>
				<div class="card-body pt-0 pb-0">
					<Setup />
				</div>
			</div>
		</div>

		<div class="card">
			<button class="card-header btn" onclick={() => toggle(1)} disabled={!isSetupValid}>
				<h6 class="mb-0 accordeon-tab">
					<i class={`pr-2 ${currentTab === 1 ? 'fa fa-angle-down' : 'fa fa-angle-right'}`} ></i>	
					NETWORK
				</h6>
			</button>

			<div class={`collapse ${currentTab === 1 ? 'show': ''}`}>
				<div class="card-body">
					<Network networks={$networkStore.networks ?? []} />
				</div>
			</div>
		</div>
		<div class="card">
			<button class="card-header btn" onclick={() => toggle(2)} disabled={!isSetupValid}>
				<h6 class="mb-0 accordeon-tab">
					<i class={`pr-2 ${currentTab === 2 ? 'fa fa-angle-down' : 'fa fa-angle-right'}`} ></i>	
					APPROVAL PROCESS
				</h6>
			</button>
			<div class={`collapse ${currentTab === 2 ? 'show': ''}`}>
				<div class="card-body">
					<ApprovalProcess approvalProcesses={$approvalProcessStore.approvalProcesses ?? []} />
				</div>
			</div>
		</div>
	
		<div class="card">
			<button class="card-header btn" onclick={() => toggle(3)} disabled={!isSetupValid}>
				<h6 class="mb-0 accordeon-tab">
					<i class={`pr-2 ${currentTab === 3 ? 'fa fa-angle-down' : 'fa fa-angle-right'}`} ></i>	
					DEPLOY
				</h6>
			</button>
			<div class={`collapse ${currentTab === 3 ? 'show': ''}`}>
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
	}
</style>