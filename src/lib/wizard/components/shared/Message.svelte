<script lang="ts">
  import StatusIcon from "./StatusIcon.svelte";

  type Props = {
    message: string;
    type: 'success' | 'error' | 'warn' | 'info' | 'loading' | 'pending';
  };

  let { message, type }: Props = $props();

  const typeToColor = {
    success: "green",
    error: "red",
    warn: "yellow",
    info: "blue",
    loading: "blue",
    pending: "yellow",
  } as const;
</script>

<div class="flex flex-row items-center gap-2">
  <StatusIcon {type} />
  <div class="text-xs text-{typeToColor[type]}-600">{@html message}</div>
</div>

