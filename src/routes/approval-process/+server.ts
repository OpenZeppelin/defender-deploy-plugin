import { createApprovalProcess } from "$lib/defender";
import type { CreateApprovalProcessRequest } from "$lib/models/approval-process";
import type { Credentials } from "$lib/models/auth";
import { attempt } from "$lib/utils/attempt";
import { json } from '@sveltejs/kit';


export async function POST({ request }: { request: Request }) {
  const { approvalProcess, credentials }: { credentials: Credentials, approvalProcess: CreateApprovalProcessRequest } = await request.json();

  // Creates a Relayer
  const [createdApprovalProcess, error] = await attempt(() => createApprovalProcess(credentials, approvalProcess));
  if (error) {
    return json({ success: false, error: error.msg });
  }

  return json({ success: true, data: { approvalProcess: createdApprovalProcess } });
}