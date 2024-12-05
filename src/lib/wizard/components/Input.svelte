<script lang="ts">
  export let label: string;
  let tooltipText = "Tooltip text here";
</script>

<div class="flex flex-col justify-items-start gap-2">
  <label for="myInput" class="flex items-center gap-1">
    {label}
    <button type="button" class="group relative">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
      <span class="invisible group-hover:visible absolute left-full ml-2 w-48 rounded bg-gray-900 px-2 py-1 text-sm text-white">
        Tooltip text here
      </span>
    </button>
  </label>
  <input 
    id="myInput"
    type="text" 
    class="rounded border p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-10"
  />
</div>

