/**
 * Generic approval process model
 */
export type ApprovalProcess = {
  approvalProcessId?: string;
  createdAt: string;
  name: string;
  component?: ComponentType;
  network?: string;
  via?: string;
  viaType?: 'EOA' | 'Contract' | 'Multisig' | 'Gnosis Safe' | 'Safe' | 'Gnosis Multisig' | 'Relayer' | 'Relayer Group' | 'Unknown' | 'Relayer Group' | 'Timelock Controller' | 'ERC20' | 'Governor' | 'Fireblocks';
  multisigSender?: string;
  relayerId?: string;
  relayerGroupId?: string;
  stackResourceId?: string;
}

export type ComponentType = ('deploy' | 'upgrade')[];

/**
 * Supported approval process creation types
 */
export const approvalProcessTypes = ['EOA', 'Safe', 'Relayer'];
export type ApprovalProcessType = typeof approvalProcessTypes[number];


/**
 * Approval Process Creation (simplified)
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/approval-process/src/models/approval-process.ts
 */
export interface CreateApprovalProcessRequest {
  viaType: 'EOA' | 'Relayer' | 'Safe';
  name: string;
  component?: ComponentType;
  network: string;
  via: string;
  multisigSender?: string;
  relayerId?: string;
}
