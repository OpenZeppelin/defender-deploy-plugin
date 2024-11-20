import type { ApprovalProcess } from "./approval-process";
import type { Relayer } from "./relayer";

/**
 * Credentials model for Defender authentication.
 */
export type Credentials = { apiKey: string, apiSecret: string };

export type ApiKeyCapability = 'create-admin-proposals' | 'manage-relayers' | 'manage-actions' | 'manage-monitors' | 'manage-deployments' | 'manage-tenant-networks' | 'manage-address-book';

export type AuthenticationResponse = { 
  credentials: Credentials, 
  permissions: ApiKeyCapability[],
  networks: string[], 
  approvalProcesses: ApprovalProcess[], 
  relayers: Relayer[]  
};
