import { listApprovalProcesses, listNetworks } from "$lib/defender";
import { attempt } from "$lib/utils";
import { json } from '@sveltejs/kit';

const parseError = (error: string) => {
  // User-friednlier error when the api key is invalid
  if (error.startsWith('Failed to get a token for')) {
    return 'Invalid API Key or API Secret';
  }
  return error;
}

export async function POST({ request }: { request: Request }) {
  const { apiKey, apiSecret } = await request.json();

  if (!apiKey || !apiSecret) {
    return json({ success: false, error: 'Missing API key or API secret' });
  }

  // List netorks to preload network selection
  const [networks, netError] = await attempt(
    () => listNetworks({ apiKey, apiSecret })
  );
  if (netError) {
    return json({ success: false, error: parseError(netError.msg) });
  }

  // List approval processes to preload approval process selection
  const [approvalProcesses, apError] = await attempt(
    () => listApprovalProcesses({ apiKey, apiSecret })
  );
  if (apError) {
    return json({ success: false, error: parseError(apError.msg) });
  }

  return json({
    success: true,
    data: {
      networks,
      approvalProcesses,
      credentials: { apiKey, apiSecret },
    }
  });
}