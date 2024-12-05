<script lang="ts">
  export let label: string;
  export let isOpen = false;
</script>

<div class="w-full">
  <button 
    class="flex w-full items-center justify-between rounded-md p-3"
    on:click={() => isOpen = !isOpen}
  >
    <span class="text-lg">{label}</span>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-5 w-5 transition-transform duration-200 {isOpen ? 'rotate-0' : '-rotate-90'}" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fill-rule="evenodd" 
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
        clip-rule="evenodd" 
      />
    </svg>
  </button>
  {#if isOpen}
    <div class="p-3">
      <slot />
    </div>
  {/if}
</div>
