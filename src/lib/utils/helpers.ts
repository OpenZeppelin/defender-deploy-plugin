import type { ApprovalProcess } from "$lib/models/approval-process";
import { getNetworkLiteral, type NetworkResponse, type TenantNetworkResponse } from "$lib/models/network";
import type { ContractSources } from "$lib/models/solc";

export const abbreviateAddress = (address: string, size = 6) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isDeploymentEnvironment = (approvalProcess: ApprovalProcess) => {
  return approvalProcess.component?.includes('deploy');
}

export const isMultisig = (viaType?: ApprovalProcess['viaType']) => {
  if (!viaType) return false;
  const multisigTypes = ['Safe', 'Multisig', 'Gnosis Safe', 'Gnosis Multisig'];
  return multisigTypes.includes(viaType);
}

export const isUpgradeable = (sources?: ContractSources) => {
  if (!sources) return false;
  return Object.keys(sources).some((path) => path.includes('@openzeppelin/contracts-upgradeable'));
}

export const debouncer = (fn: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
