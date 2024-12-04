<script lang="ts">
  import type { DropdownItem } from "$lib/models/ui";
  import { createEventDispatcher } from "svelte";

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
</script>

<div class="flex flex-col">
  <select name={name} id={name} bind:value={selected} disabled={disabled} class="border border-gray-300 rounded-md cursor-pointer p-2">
    {#each Object.entries(groupedItems) as [group, items]}
      {#if group !== 'default'}
        <option value={group}>{group}</option>
      {/if}
  
      {#each items as item}
        <option value={item.value} onclick={() => onSelect(item)}>{item.label}</option>
      {/each}
    {/each}
  </select>
</div>


<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 8l-6-6h12l-6 6z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 8px 8px;
  }
</style>
