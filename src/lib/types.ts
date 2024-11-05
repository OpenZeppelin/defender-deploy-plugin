
export type GlobalState = {
  authenticated: boolean;
  credentials: Credentials;
  networks: string[];
  approvalProcesses: ApprovalProcess[];
  form: any; // to be defined
};

export type Credentials = { apiKey: string, apiSecret: string };

export type ApprovalProcess = {
  approvalProcessId: string;
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
