import type { ContractSources } from "./models/sources";
import { wizardState } from "./state.svelte";

export interface DefenderDeployMessage {
  kind: 'oz-wizard-defender-deploy';
  sources: ContractSources;
}

export const initWizardPlugin = () => {
  // when users configure a contract, the plugin gets the results.
  listenToContracts();
}

function listenToContracts() {
  window.addEventListener('message', function (e: MessageEvent<DefenderDeployMessage>) {
    if (e.data.kind === 'oz-wizard-defender-deploy') {
      wizardState.sources = e.data.sources;
    }
  });
}
