import type { ApprovalProcess } from "./approval-process";
import type { Relayer } from "./relayer";

/**
 * Credentials model for Defender authentication.
 */
export type Credentials = { apiKey: string, apiSecret: string };

export type AuthenticationResponse = { 
  credentials: Credentials, 
  networks: string[], 
  approvalProcesses: ApprovalProcess[], 
  relayers: Relayer[]  
};
