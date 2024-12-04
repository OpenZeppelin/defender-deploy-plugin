
import type { ContractSources } from "./models/sources";

export const wizardState = $state<{ sources: ContractSources | undefined }>({
  sources: undefined,
});
