import { deployContract, getDeployment, updateDeployment } from "$lib/defender";
import type { Credentials } from "$lib/models/auth";
import type { DeployContractRequest, UpdateDeploymentRequest } from "$lib/models/deploy";
import { attempt } from "$lib/utils";
import { json } from '@sveltejs/kit';


export async function POST({ request }: { request: Request }) {
  const { deployment, credentials }: { credentials: Credentials, deployment: DeployContractRequest } = await request.json();

  const [deploymentResult, error] = await attempt(() => deployContract(credentials, deployment));
  if (error) {
    return json({ success: false, error: error.msg });
  }

  return json({ success: true, data: { deployment: deploymentResult } });
}

export async function PUT({ request }: { request: Request }) {
  const { deployment, credentials }: { credentials: Credentials, deployment: UpdateDeploymentRequest } = await request.json();

  const [result, error] = await attempt(() => updateDeployment(credentials, deployment));
  if (error) {
    return json({ success: false, error: error.msg });
  }

  return json({ success: true, data: { result } });
}

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const deploymentId = url.searchParams.get('deploymentId');
  const credentials = JSON.parse(request.headers.get('authorization') || '{}');

  if (!deploymentId) {
    return json({ success: false, error: "Missing deploymentId parameter" });
  }

  if (!credentials) {
    return json({ success: false, error: "Missing Credentials" });
  }

  const [result, error] = await attempt(() => getDeployment(credentials, deploymentId));
  if (error) {
    return json({ success: false, error: error.msg });
  }

  if (!result) {
    return json({ success: false, error: "Deployment not found" });
  }

  return json({ success: true, data: { address: result.address, hash: result.txHash } });
}
