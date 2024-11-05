
import type { Credentials } from '$lib/types';
import { Defender } from '@openzeppelin/defender-sdk';

export const listNetworks = async (credentials: Credentials) => {
  const client = new Defender(credentials);
  const networks = await client.network.listSupportedNetworks();
  return networks;
}

export const listApprovalProcesses = async (credentials: Credentials) => {
  const client = new Defender(credentials);
  const approvalProcesses = await client.approvalProcess.list();
  return approvalProcesses;
}