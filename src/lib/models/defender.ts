/**
 * Credentials model for Defender authentication.
 */
export type Credentials = { apiKey: string, apiSecret: string };

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

/**
 * Relayer models (simplified)
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/relay/src/models/index.ts
 */
export type BigUInt = string | number;
export interface CreateRelayerRequest {
  name: string;
  network: string;
  minBalance: BigUInt;
}

export interface RelayerGetResponse {
  relayerId: string;
  name: string;
  address: string;
  network: string;
  paused: boolean;
  pendingTxCost: string;
  minBalance: BigUInt;
}

/**
 * Deploy Contract Models (simplified)
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/deploy/src/models/deployment.ts
 */
export interface DeployContractRequest {
  contractName: string;
  contractPath: string;
  network: string;
  artifactPayload?: string;
  artifactUri?: string;
  value?: string;
  salt?: string;
  verifySourceCode: boolean;
  licenseType?: SourceCodeLicense;
  /**
   * @example { "contracts/Library.sol:LibraryName": "0x1234567890123456789012345678901234567890" }
   */
  libraries?: DeployRequestLibraries;
  constructorInputs?: (string | boolean | number)[];
  constructorBytecode?: string;
  relayerId?: string;
  approvalProcessId?: string;
  createFactoryAddress?: string;
}

export type SourceCodeLicense = 'None' | 'Unlicense' | 'MIT' | 'GNU GPLv2' | 'GNU GPLv3' | 'GNU LGPLv2.1' | 'GNU LGPLv3' | 'BSD-2-Clause' | 'BSD-3-Clause' | 'MPL-2.0' | 'OSL-3.0' | 'Apache-2.0' | 'GNU AGPLv3' | 'BSL 1.1';

export interface DeployRequestLibraries {
  [k: `${string}:${string}`]: string;
}