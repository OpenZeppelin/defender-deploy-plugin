<script lang="ts">
  type Props = {
    message: string;
    type: 'success' | 'error' | 'warn';
  };

  let { message, type }: Props = $props();
</script>

{#if type === 'success'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-check-circle-o text-green-600`}></i>
    <div class="text-xs text-green-600">{message}</div>
  </div>
{:else if type === 'error'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-times-circle-o text-red-600`}></i>
    <div class="text-xs text-red-600">{message}</div>
  </div>
{:else if type === 'warn'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-exclamation-triangle text-yellow-600`}></i>
    <div class="text-xs text-yellow-600">{message}</div>
  </div>
{/if}
