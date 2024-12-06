<script lang="ts">
  import type { DropdownItem } from "$lib/models/ui";
  import { createEventDispatcher } from "svelte";

  function clickOutside(node: HTMLElement, handler: () => void) {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('click', handleClick, true);

    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }

  type Props = {
    placeholder: string;
    items: DropdownItem[];
    disabled?: boolean;
    emptyLabel?: string;
    defaultItem?: DropdownItem;
    name?: string;
  };

  const dispatch = createEventDispatcher<{
    select: DropdownItem;
  }>();

  const { placeholder, items, disabled, emptyLabel, defaultItem, name }: Props =
    $props();

  const groupedItems = $derived(items.reduce((acc, item) => {
    const group = item.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, DropdownItem[]>));

  // network selection logic
  let selected = $state<DropdownItem | undefined>(defaultItem);
  const onSelect = (item: DropdownItem) => {
    selected = item;
    dispatch("select", item);
  };  
  let isOpen = $state(false);
  
  const toggleDropdown = () => {
    if (!disabled) isOpen = !isOpen;
  };

  const handleSelect = (item: DropdownItem) => {
    selected = item;
    isOpen = false;
    dispatch("select", item);
  };

  const handleClickOutside = () => {
    isOpen = false;
  };
</script>

<div class="relative w-full" use:clickOutside={handleClickOutside}>
  <button
    type="button"
    class="w-full flex items-center justify-between border border-gray-300 disabled:opacity-50 rounded-md p-2 text-xs bg-white"
    onclick={toggleDropdown}
    disabled={disabled}
    {name}
  >
    <span class="truncate">
      {selected ? selected.label : placeholder}
    </span>
    <i class="fa fa-chevron-down text-[8px] transition-transform duration-200 font-light {isOpen ? 'rotate-180' : ''}"></i>
  </button>

  {#if isOpen}
    <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {#each Object.entries(groupedItems) as [group, items]}
        {#if group !== 'default'}
          <div class="px-2 py-1 text-xs font-semibold bg-gray-50 text-gray-700">{group}</div>
        {/if}
        {#each items.sort((a, b) => a.label.localeCompare(b.label)) as item}
          <button
            type="button"
            class="w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {selected?.value === item.value ? 'bg-gray-50' : ''}"
            onclick={() => handleSelect(item)}
          >
            {item.label}
          </button>
        {/each}
      {/each}
      {#if items.length === 0}
        <div class="px-2 py-1.5 text-xs text-gray-500">
          {emptyLabel ?? "No items available"}
        </div>
      {/if}
    </div>
  {/if}
</div>