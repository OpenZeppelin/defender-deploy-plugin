import type { TenantNetworkResponse } from "./network";
import type { GlobalState } from "./ui";

/**
 * Generic approval process model
 */
export type ApprovalProcess = {
  approvalProcessId?: string;
  createdAt: string;
  name: string;
  component?: ComponentType;
  network?: string | TenantNetworkResponse;
  via?: string;
  viaType?: 'EOA' | 'Contract' | 'Multisig' | 'Gnosis Safe' | 'Safe' | 'Gnosis Multisig' | 'Relayer' | 'Relayer Group' | 'Unknown' | 'Relayer Group' | 'Timelock Controller' | 'ERC20' | 'Governor' | 'Fireblocks';
  multisigSender?: string;
  relayerId?: string;
  relayerGroupId?: string;
  stackResourceId?: string;
}

export type ApprovalProcessToCreate = {
  viaType: ApprovalProcessType;
  via?: string;
  relayerId?: string;
  network?: string;
}

export type ComponentType = ('deploy' | 'upgrade')[];

/**
 * Supported approval process creation types
 */
export const approvalProcessTypes = ['EOA', 'Safe', 'Relayer'] as const;
export type ApprovalProcessType = typeof approvalProcessTypes[number];


/**
 * Approval Process Creation (simplified)
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/approval-process/src/models/approval-process.ts
 */
export interface CreateApprovalProcessRequest {
  viaType: ApprovalProcessType;
  name: string;
  component?: ComponentType;
  network: string;
  via: string;
  multisigSender?: string;
  relayerId?: string;
}


export function approvalProcessByNetworkAndComponent(network: GlobalState["form"]["network"]) {
  return (ap: ApprovalProcess) => {
    const networkName =
      typeof network === "string"
        ? network
        : network?.name;

    return ap.network === networkName && ap.component?.includes("deploy");
  }
}