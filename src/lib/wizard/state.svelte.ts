import type { ContractSources } from "../models/solc";

export const wizardState = $state<{ sources: ContractSources | undefined }>({
  sources: undefined,
});
