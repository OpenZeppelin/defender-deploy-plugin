import { createApprovalProcess, createRelayer } from "$lib/defender";
import type { CreateApprovalProcessRequest, Credentials } from "$lib/models/defender";
import { attempt } from "$lib/utils";
import { json } from '@sveltejs/kit';


export async function POST({ request }: { request: Request }) {
  const { approvalProcess, credentials }: { credentials: Credentials, approvalProcess: CreateApprovalProcessRequest} = await request.json();

  // Creates a Relayer
  const [createdApprovalProcess, error] = await attempt(() => createApprovalProcess(credentials, approvalProcess));
  if (error) {
    return json({ success: false, error });
  }

  return json({ success: true, data: { approvalProcess: createdApprovalProcess }  });
}