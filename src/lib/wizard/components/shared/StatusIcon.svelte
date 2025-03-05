<script lang="ts">
  type Props = {
    type: "success" | "error" | "warn" | "info" | "loading" | "pending";
  };
  let { type }: Props = $props();
</script>

{#if type === "success"}
  <i class={`fa fa-check-circle-o text-green-600`}></i>
{:else if type === "error"}
  <i class={`fa fa-times-circle-o text-red-600`}></i>
{:else if type === "warn"}
  <i class={`fa fa-exclamation-triangle text-yellow-600`}></i>
{:else if type === "info"}
  <i class={`fa fa-info-circle text-blue-600`}></i>
{:else if type === "loading"}
  <i class={"fa fa-circle-o-notch fa-spin text-blue-600"}></i>
{:else if type === "pending"}
  <i class={`fa fa-circle-o text-yellow-600`}></i>
{/if}