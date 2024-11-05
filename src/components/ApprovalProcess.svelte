
<script lang="ts">
  import type { ApprovalProcess } from "$lib/types";

  const { approvalProcesses }: { approvalProcesses: ApprovalProcess[] } = $props();

	// network selection logic
	let approvalProcess = $state<ApprovalProcess>();
	const onNetworkSelect = (ap: any) => {
		approvalProcess = ap;
	}
</script>

<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    {approvalProcess ? approvalProcess.approvalProcessId  : 'Approval Process'}
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    {#each approvalProcesses as ap}
      <button type="button" class="dropdown-item" onclick={() => onNetworkSelect(ap)}>
        {ap.approvalProcessId}
      </button>
    {/each}
  </div>
</div>