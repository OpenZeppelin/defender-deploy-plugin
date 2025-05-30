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

<div class="dropdown mt-2 mb-2">
  <button
    {name}
    class="btn btn-secondary col form-control"
    type="button"
    id="dropdownMenuButton1"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    {disabled}
  >
    <span
      class="d-flex justify-content-between align-items-center dropdown-selection"
    >
      {selected ? selected.label : placeholder}
      <i class="fa fa-sort"></i>
    </span>
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    {#each Object.entries(groupedItems) as [group, items]}
      {#if group !== 'default'}
        <div class="dropdown-header">
          <small>{group}</small>
          <hr class="p-0 m-0 border-secondary"/>
        </div>
      {/if}
      {#each items.sort((a, b) => a.label.localeCompare(b.label)) as item}
        <button
          type="button"
          class="dropdown-item"
          onclick={() => onSelect(item)}
        >
          {item.label}
        </button>
      {/each}
    {/each}
    {#if items.length === 0}
      <button type="button" class="dropdown-item" disabled>
        <small>{emptyLabel ?? "No items available"}</small>
      </button>
    {/if}
  </div>
</div>

<style>
  .dropdown-selection {
    color: lightgray;
    font-size: smaller;
  }

  .dropdown-menu {
    background: var(--custom-select);
  }

  .dropdown-item {
    cursor: pointer;
    font-size: smaller;
    background: var(--custom-select);
    color: var(--text);
  }
</style>
