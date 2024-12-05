<script lang="ts">
  export let label: string;
  export let onClick: () => void;
  export let disabled = false;
</script>

<button 
  class="w-full rounded-md p-2 font-bold {disabled 
    ? 'bg-gray-400 cursor-not-allowed' 
    : 'bg-indigo-600 hover:bg-indigo-700'} text-white" 
  on:click={onClick}
  disabled={disabled}
>
  {label}
</button>
