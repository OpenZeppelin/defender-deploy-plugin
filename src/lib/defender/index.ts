

import type { CreateApprovalProcessRequest, Credentials } from '$lib/models/defender';
import { Defender } from '@openzeppelin/defender-sdk';

const getClient = (credentials: Credentials) => {
  return new Defender({
    ...credentials,
    retryConfig: {
      retries: 0,
      retryDelay: () => 0,
      retryCondition: () => false
    }
  });
}

export const listNetworks = async (credentials: Credentials) => {
  const client = getClient(credentials);
  const networks = await client.network.listSupportedNetworks();
  return networks;
}

export const listApprovalProcesses = async (credentials: Credentials) => {
  const client = getClient(credentials);
  const approvalProcesses = await client.approvalProcess.list();
  return approvalProcesses;
}

export const createApprovalProcess = async (credentials: Credentials, approvalProcess: CreateApprovalProcessRequest) => {
  const client = getClient(credentials);
  const response = await client.approvalProcess.create(approvalProcess);
  return response;
}