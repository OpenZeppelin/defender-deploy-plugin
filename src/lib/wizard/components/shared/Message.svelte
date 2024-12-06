<script lang="ts">
  type Props = {
    message: string;
    type: 'success' | 'error';
  };

  let { message, type }: Props = $props();

  let color = type === 'success' ? 'green' : 'red';
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
{/if}