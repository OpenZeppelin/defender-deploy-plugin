<script lang="ts">
  import { initPlugin } from "$lib";
  import { onMount } from "svelte";

  let { form } = $props();

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
					<form method="POST" action="?/authenticate">
						<label for="apiKey" >Api Key (required)</label>
						<input id="apiKey" type="text" class="form-control" name="apiKey" placeholder="* API Key">
			
						<label for="apiSecret" >Api Secret (required)</label>
						<input id="apiSecret" type="password" class="form-control"  name="apiSecret" placeholder="* API Secret">
						
						<button class="btn btn-primary mt-4 col">Save</button>
					</form>

					{#if form}
						<pre>{JSON.stringify(form, null, 2)}</pre>
					{/if}
				</div>
			</div>
		</div>

		<div class="card">
			<button class="card-header btn" onclick={() => toggle(1)}>
				<h6 class="mb-0 accordeon-tab">
					<i class={`pr-2 ${currentTab === 1 ? 'fa fa-angle-down' : 'fa fa-angle-right'}`} ></i>	
					NETWORK
				</h6>
			</button>

			<div class={`collapse ${currentTab === 1 ? 'show': ''}`}>
				<div class="card-body">
					Network step!
				</div>
			</div>
		</div>
		<div class="card">
			<button class="card-header btn" onclick={() => toggle(2)}>
				<h6 class="mb-0 accordeon-tab">
					<i class={`pr-2 ${currentTab === 2 ? 'fa fa-angle-down' : 'fa fa-angle-right'}`} ></i>	
					APPROVAL PROCESS
				</h6>
			</button>
			<div class={`collapse ${currentTab === 2 ? 'show': ''}`}>
				<div class="card-body">
					Approval process step!
				</div>
			</div>
		</div>
	
		<div class="card">
			<button class="card-header btn" onclick={() => toggle(3)}>
				<h6 class="mb-0 accordeon-tab">
					<i class={`pr-2 ${currentTab === 3 ? 'fa fa-angle-down' : 'fa fa-angle-right'}`} ></i>	
					DEPLOY
				</h6>
			</button>
			<div class={`collapse ${currentTab === 3 ? 'show': ''}`}>
				<div class="card-body">
					Deploy step!
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