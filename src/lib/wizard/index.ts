import type { ContractSources } from "../models/solc";
import { globalState } from "$lib/state/state.svelte";

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
      globalState.contract = { source: e.data.sources } ;
    }
  });
}
