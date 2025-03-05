import { listApiKeyPermissions, listApprovalProcesses, listBlockExplorerKeys, listNetworks, listRelayers } from "$lib/defender";
import type { Relayer } from "$lib/models/relayer";
import { json } from '@sveltejs/kit';
import type { AuthenticationResponse } from "$lib/models/auth";

type ApiKeysPermissions = Awaited<ReturnType<typeof listApiKeyPermissions>>
type ApiCredentials = { apiKey: string, apiSecret: string }

const parseError = (error: string, component: string) => {
  // User-friednlier error when the api key is invalid
  if (error.startsWith('Failed to get a token for')) {
    return 'Invalid API Key or API Secret';
  }
  return `Loading ${component}: ${error}`;
}

const awaitRequestOrFailWith = async <T>(requestPromise: Promise<T>, component: string) => {
  try {
    return await requestPromise
  } catch(error) {
    throw new Error(parseError((error as Error).message, component))
  }
};

export async function POST({ request }: { request: Request }): Promise<Response> {
  try {
    const { apiKey, apiSecret }: ApiCredentials = await request.json();

    if (!apiKey || !apiSecret) {
      throw new Error('Missing API key or API secret')
    }

    const [apiKeyPermissions, networks, approvalProcesses, blockExplorerKeys] = await Promise.all([
      awaitRequestOrFailWith( listApiKeyPermissions({ apiKey, apiSecret }), 'Permissions'),
      awaitRequestOrFailWith( listNetworks({ apiKey, apiSecret }), 'Networks'),
      awaitRequestOrFailWith( listApprovalProcesses({ apiKey, apiSecret }), 'Approval Processes'),
      awaitRequestOrFailWith( listBlockExplorerKeys({ apiKey, apiSecret }), 'Block Explorer ApiKeys'),
    ]);

    if (!apiKeyPermissions?.includes('manage-deployments')) {
      throw new Error('API Key is not allowed to deploy contracts');
    }

    const relayers: Relayer[] =
      apiKeyPermissions?.includes('manage-relayers') ?
      await awaitRequestOrFailWith(listRelayers({ apiKey, apiSecret }), 'Relayers')
      : []

    const authenticationResponse: AuthenticationResponse = {
      permissions: apiKeyPermissions,
      blockExplorerKeys,
      networks,
      approvalProcesses,
      relayers,
      credentials: { apiKey, apiSecret },
    }
  
    return json({
      success: true,
      data: authenticationResponse
    });

  } catch(error){
    return json({ success: false, error: (error as Error).message });
  }
}