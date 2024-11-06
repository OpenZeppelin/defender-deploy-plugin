<script lang="ts">
  import type { ApprovalProcess } from "$lib/types";
  import { globalState } from "$lib/state/state.svelte";

  const { approvalProcesses }: { approvalProcesses: ApprovalProcess[] } =
    $props();

  const toDisplayName = (ap: ApprovalProcess) => `${ap.name} (${ap.network})`;

  // network selection logic
  let approvalProcess = $state<ApprovalProcess>();
  const onNetworkSelect = (ap: any) => {
    approvalProcess = ap;
    globalState.form.approvalProcess = ap;
  };
</script>

<div class="dropdown">
  <button
    class="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenuButton1"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    {approvalProcess ? toDisplayName(approvalProcess) : "Approval Process"}
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    {#each approvalProcesses as ap}
      <button
        type="button"
        class="dropdown-item"
        onclick={() => onNetworkSelect(ap)}
      >
        {toDisplayName(ap)}
      </button>
    {/each}
  </div>
</div>
