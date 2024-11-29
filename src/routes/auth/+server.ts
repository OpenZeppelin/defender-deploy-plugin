import { listApiKeyPermissions, listApprovalProcesses, listNetworks, listRelayers } from "$lib/defender";
import type { Relayer } from "$lib/models/relayer";
import { attempt } from "$lib/utils/attempt";
import { json } from '@sveltejs/kit';

const parseError = (error: string, component: string) => {
  // User-friednlier error when the api key is invalid
  if (error.startsWith('Failed to get a token for')) {
    return 'Invalid API Key or API Secret';
  }
  return `Loading ${component}: ${error}`;
}

export async function POST({ request }: { request: Request }) {
  const { apiKey, apiSecret } = await request.json();

  if (!apiKey || !apiSecret) {
    return json({ success: false, error: 'Missing API key or API secret' });
  }

  // List API key permissions
  const [permissions, permError] = await attempt(
    () => listApiKeyPermissions({ apiKey, apiSecret })
  );
  if (permError) {
    return json({ success: false, error: parseError(permError.msg, 'Permissions') });
  }

  if (!permissions?.includes('manage-deployments')) {
    return json({ success: false, error: 'API Key is not allowed to deploy contracts' });
  }

  // List netorks to preload network selection
  const [networks, netError] = await attempt(
    () => listNetworks({ apiKey, apiSecret })
  );
  if (netError) {
    return json({ success: false, error: parseError(netError.msg, 'Networks') });
  }

  // List approval processes to preload approval process selection
  const [approvalProcesses, apError] = await attempt(
    () => listApprovalProcesses({ apiKey, apiSecret })
  );
  if (apError) {
    return json({ success: false, error: parseError(apError.msg, 'Approval Processes') });
  }

  let relayers: Relayer[] = [];
  if (permissions?.includes('manage-relayers')) {
    // List relayers to preload approval process creation selection.
    const [relayersResult, relayError] = await attempt(
      () => listRelayers({ apiKey, apiSecret })
    );
    if (relayError) {
      return json({ success: false, error: parseError(relayError.msg, 'Relayers') });
    }
    relayers = relayersResult ?? [];
  }


  return json({
    success: true,
    data: {
      permissions,
      networks,
      approvalProcesses,
      relayers,
      credentials: { apiKey, apiSecret },
    }
  });
}