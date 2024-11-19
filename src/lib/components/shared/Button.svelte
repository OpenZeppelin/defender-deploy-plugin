<script lang="ts">
  type Props = {
    loading?: boolean;
    loadingMessage?: string;
    title: string;
    onclick: () => void;
    disabled?: boolean;
  };

  const { loading, title, onclick, disabled, loadingMessage }: Props = $props();
</script>

<button
  class="btn btn-primary mt-2 mb-2 col"
  disabled={loading || disabled}
  {onclick}
>
  {#if loading}
    {#if loadingMessage}
      {loadingMessage}
    {:else}
    <span
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
    {/if}
  {:else}
    {title}
  {/if}
</button>
