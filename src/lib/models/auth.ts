import type { ApprovalProcess } from "./approval-process";
import type { BlockExplorerKey } from "./block-explorer-key";
import type { TenantNetworkResponse } from "./network";
import type { Relayer } from "./relayer";

/**
 * Credentials model for Defender authentication.
 */
export type Credentials = { apiKey: string, apiSecret: string };

export type ApiKeyCapability = 'create-admin-proposals' | 'manage-relayers' | 'manage-actions' | 'manage-monitors' | 'manage-deployments' | 'manage-tenant-networks' | 'manage-address-book';

export type AuthenticationResponse = { 
  credentials: Credentials, 
  permissions: ApiKeyCapability[],
  networks: (string | TenantNetworkResponse)[], 
  approvalProcesses: ApprovalProcess[], 
  relayers: Relayer[]
  blockExplorerKeys: BlockExplorerKey[]
};
