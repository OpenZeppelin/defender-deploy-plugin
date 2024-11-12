
<script lang="ts">
  type Props = {
    loading?: boolean;
    title: string;
    onclick: () => void;
    disabled?: boolean;
  };
 
  const { loading, title, onclick, disabled }: Props = $props();
</script>

<button
  class="btn btn-primary mt-2 mb-2 col"
  disabled={loading || disabled}
  onclick={onclick}
>
  {#if loading}
    <span
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
  {:else}
    {title}
  {/if}
</button>
