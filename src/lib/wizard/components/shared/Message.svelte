<script lang="ts">
  type Props = {
    message: string;
    type: 'success' | 'error' | 'warn' | 'info' | 'loading' | 'tip';
  };

  let { message, type }: Props = $props();
</script>

{#if type === 'success'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-check-circle-o text-green-600`}></i>
    <div class="text-xs text-green-600">{@html message}</div>
  </div>
{:else if type === 'error'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-times-circle-o text-red-600`}></i>
    <div class="text-xs text-red-600">{@html message}</div>
  </div>
{:else if type === 'warn'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-exclamation-triangle text-yellow-600`}></i>
    <div class="text-xs text-yellow-600">{@html message}</div>
  </div>
{:else if type === 'info'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-info-circle text-blue-600`}></i>
    <div class="text-xs text-blue-600">{@html message}</div>
  </div>
{:else if type === 'tip'}
  <div class="flex flex-row items-center gap-2">
    <i class={`fa fa-lightbulb-o text-lime-600`}></i>
    <div class="text-xs text-gray-600">{@html message}</div>
  </div>
{:else if type === 'loading'}
  <div class="flex flex-row items-center gap-2">
    <i class={"fa fa-circle-o-notch fa-spin text-blue-600"}></i>
    <div class="text-xs text-blue-600">{@html message}</div>
  </div>
{/if}

