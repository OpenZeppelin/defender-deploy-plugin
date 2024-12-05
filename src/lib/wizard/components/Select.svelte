
<script lang="ts">
  export let label: string | undefined = undefined;
  export let options: { value: string; label: string }[] = [];
  export let value: string = "";
  export let tooltipText: string = "";
  
  let isOpen = false;
  
  function handleSelect(optionValue: string) {
    value = optionValue;
    isOpen = false;
  }
</script>

<div class="flex flex-col justify-items-start gap-2">
  <label class="flex items-center gap-1">
    {label}
    {#if tooltipText}
      <button type="button" class="group relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        <span class="invisible group-hover:visible absolute left-full ml-2 w-48 rounded bg-gray-900 px-2 py-1 text-sm text-white">
          {tooltipText}
        </span>
      </button>
    {/if}
  </label>
  
  <div class="relative min-h-10">
    <button
      type="button"
      class="w-full rounded border p-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex justify-between items-center"
      on:click={() => isOpen = !isOpen}
    >
      <span>{value ? options.find(opt => opt.value === value)?.label : 'Select an option'}</span>
      <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    {#if isOpen}
      <div class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border">
        <ul class="max-h-60 overflow-auto py-1">
          {#each options as option}
            <li>
              <button
                type="button"
                class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                on:click={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

