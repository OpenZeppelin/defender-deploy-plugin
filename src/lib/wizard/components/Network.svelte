<script lang="ts">
    import Dropdown from "./shared/Dropdown.svelte";



</script>

<Dropdown 
  placeholder="Select Network"
  items={[{
    label: "Ethereum Mainnet",
    value: "mainnet"
  },
  {
    label: "Sepolia",
    value: "sepolia"
  }]}
  name="network"
/>