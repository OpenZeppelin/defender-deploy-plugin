<script lang="ts">
    import { API } from "$lib/api";
    import { buildCompilerInput, type ContractSources } from "$lib/models/solc";
    import { wizardState } from "../state.svelte";
    import Select from "./Select.svelte";
  
    let compilationResult: any;
  
    async function compile() {
      if (!wizardState.sources) return;
      compilationResult = await API.compile(buildCompilerInput(wizardState.sources));
    }
  
    function getMainContractName(sources?: ContractSources) {
      if (!sources) return '';
      // The first name that is not a dependency
      return Object.keys(sources).find(name => !name.startsWith('@'));
    }
  
  </script>
  <Select label="Deploy to Network" options={[
    { value: 'mainnet', label: 'Mainnet' },
    { value: 'sepolia', label: 'Sepolia' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'base', label: 'Base' },
    { value: 'zksync', label: 'ZkSync' },
    { value: 'scroll', label: 'Scroll' },
    { value: 'zksync-era', label: 'ZkSync Era' },
    { value: 'optimism-nova', label: 'Optimism Nova' },
    { value: 'optimism-sepolia', label: 'Optimism Sepolia' },
    { value: 'arbitrum-sepolia', label: 'Arbitrum Sepolia' },
    { value: 'base-sepolia', label: 'Base Sepolia' },
    { value: 'scroll-sepolia', label: 'Scroll Sepolia' },
    { value: 'zksync-era-sepolia', label: 'ZkSync Era Sepolia' }
  ]} />
  