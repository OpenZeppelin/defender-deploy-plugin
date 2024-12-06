<script lang="ts">
  type Props = {
    label?: string;
    value: string;
    placeholder: string;
    type: 'text' | 'password';
  };
  let { label, value, placeholder, type }: Props = $props();
</script>

{#if label}
  <label class="text-sm" for="apiSecret">{label}</label>
{/if}
<input name="apiSecret" type={type} bind:value={value} placeholder={placeholder} class="border border-gray-300 rounded-md p-2 w-full" />
