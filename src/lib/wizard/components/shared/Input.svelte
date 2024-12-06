<script lang="ts">
  type Props = {
    label?: string;
    value: string;
    placeholder: string;
    type: 'text' | 'password';
    disabled?: boolean;
  };
  let { label, value, placeholder, type, disabled }: Props = $props();
</script>

{#if label}
  <label class="text-xs" for="apiSecret">{label}</label>
{/if}
<input name="apiSecret" type={type} bind:value={value} placeholder={placeholder} disabled={disabled} class="border text-xs border-gray-300 disabled:opacity-50 rounded-md p-2 w-full" />
