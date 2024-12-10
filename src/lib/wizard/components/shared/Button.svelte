<script lang="ts">
  type Props = {
    loading: boolean;
    onClick: () => void;
    label: string;
    disabled?: boolean;
  };
  const { loading, onClick, label, disabled }: Props = $props();
</script>

<button onclick={onClick} disabled={disabled || loading} class=" text-white text-sm rounded-md p-2 mt-2 {loading || disabled ? 'bg-gray-400' : 'bg-indigo-600'}">
  {#if loading}
    <i class="fa fa-circle-o-notch fa-spin"></i>
  {/if}
  {#if !loading}
    {label}
  {/if}
</button>