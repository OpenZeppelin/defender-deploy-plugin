import type { CreateApprovalProcessRequest } from '$lib/models/approval-process';
import type { Credentials } from '$lib/models/auth';
import type { DeployContractRequest, UpdateDeploymentRequest } from '$lib/models/deploy';
import type { CreateRelayerRequest } from '$lib/models/relayer';
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

export const listApiKeyPermissions = async (credentials: Credentials) => {
  const client = getClient(credentials);
  const capabilities = await client.account.listApiKeyCapabilities();
  return capabilities;
}

export const listNetworks = async (credentials: Credentials) => {
  const client = getClient(credentials);
  const [networks, forkedNetworks, privateNetworks] = await Promise.all([
    client.network.listSupportedNetworks(),
    client.network.listForkedNetworks(),
    client.network.listPrivateNetworks(),
  ]);
  return [...networks, ...forkedNetworks, ...privateNetworks];
}

export const listApprovalProcesses = async (credentials: Credentials) => {
  const client = getClient(credentials);
  const approvalProcesses = await client.approvalProcess.list();
  return approvalProcesses;
}

export const listRelayers = async (credentials: Credentials) => {
  const client = getClient(credentials);
  const relayers = await client.relay.list();
  return relayers.items;
}

export const createApprovalProcess = async (credentials: Credentials, approvalProcess: CreateApprovalProcessRequest) => {
  const client = getClient(credentials);
  const response = await client.approvalProcess.create(approvalProcess as any);
  return response;
}

export const createRelayer = async (credentials: Credentials, relayer: CreateRelayerRequest) => {
  const client = getClient(credentials);
  const response = await client.relay.create(relayer);
  return response;
}

export const deployContract = async (credentials: Credentials, deployment: DeployContractRequest) => {
  const client = getClient(credentials);
  const response = await client.deploy.deployContract(deployment);
  return response;
}

export const updateDeployment = async (credentials: Credentials, updateReq: UpdateDeploymentRequest) => {
  const client = getClient(credentials);
  const response = await client.deploy.updateDeployment(updateReq.deploymentId, {
    txHash: updateReq.hash,
    address: updateReq.address,
  });
  return response;
}