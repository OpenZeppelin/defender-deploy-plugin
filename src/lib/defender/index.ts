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
  return await client.account.listApiKeyCapabilities();
}

export const listNetworks = async (credentials: Credentials) => {
  const client = getClient(credentials);

  const [nativeNetworks, forkedNetworks, privateNetworks] = (await Promise.all([
    client.network.listSupportedNetworks({ networkType: ["deploy"], includeDefinition: true }),
    client.network.listForkedNetworks(),
    client.network.listPrivateNetworks(),
  ]))

  return [
    nativeNetworks
      .map((network) => ({...network, networkType: "native"} as const)),
    forkedNetworks,
    privateNetworks
  ].flat()
}

export const listApprovalProcesses = async (credentials: Credentials) => {
  const client = getClient(credentials);
  return await client.approvalProcess.list();
}

export const listRelayers = async (credentials: Credentials) => {
  const client = getClient(credentials);
  const relayers = await client.relay.list();
  return relayers.items;
}

export const createApprovalProcess = async (credentials: Credentials, approvalProcess: CreateApprovalProcessRequest) => {
  const client = getClient(credentials);
  return await client.approvalProcess.create(approvalProcess as any);
}

export const createRelayer = async (credentials: Credentials, relayer: CreateRelayerRequest) => {
  const client = getClient(credentials);
  return await client.relay.create(relayer);
}

export const deployContract = async (credentials: Credentials, deployment: DeployContractRequest) => {
  const client = getClient(credentials);
  return await client.deploy.deployContract(deployment);
}

export const updateDeployment = async (credentials: Credentials, updateReq: UpdateDeploymentRequest) => {
  const client = getClient(credentials);
  return await client.deploy.updateDeployment(updateReq.deploymentId, {
    txHash: updateReq.hash,
    address: updateReq.address,
  });
}

export const getDeployment = async (credentials: Credentials, deploymentId: string) => {
  const client = getClient(credentials);
  return await client.deploy.getDeployedContract(deploymentId);
}

export const listBlockExplorerKeys = async (credentials: Credentials) => await getClient(credentials).deploy.listBlockExplorerApiKeys()