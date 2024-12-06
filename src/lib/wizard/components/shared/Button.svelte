<script lang="ts">
  type Props = {
    loading: boolean;
    onClick: () => void;
    label: string;
  };
  const { loading, onClick, label }: Props = $props();
</script>

<button onclick={onClick} disabled={loading} class="bg-blue-600 text-white text-sm rounded-md p-2 mt-2" class:bg-gray-400={loading}>
  {#if loading}
    <i class="fa fa-spinner fa-spin"></i>
  {/if}
  {#if !loading}
    {label}
  {/if}
</button>