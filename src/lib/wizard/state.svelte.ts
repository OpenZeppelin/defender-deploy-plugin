import type { ContractSources } from "../models/solc";

export const wizardState = $state<{ sources: ContractSources | undefined, apiKey: string, apiSecret: string }>({
  sources: undefined,
  apiKey: '',
  apiSecret: '',
});
