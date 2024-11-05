import { listApprovalProcesses, listNetworks } from "$lib/server/defender";
import type { Credentials } from "$lib/types";
import type { Actions } from "@sveltejs/kit";

const extractCredentials = async (request: Request): Promise<Partial<Credentials>> => {
	const data = await request.formData();
	const apiKey = data.get('apiKey')?.toString();
	const apiSecret = data.get('apiSecret')?.toString();
	return { apiKey, apiSecret };
}

export const actions = {
	// Authenticate the defender account.
	authenticate: async ({ request }) => {
    const { apiKey, apiSecret } = await extractCredentials(request);

		if (!apiKey || !apiSecret) {
			return { success: false, error: 'Missing API key or API secret' };
		}

		const networks = await listNetworks({apiKey, apiSecret});
		const approvalProcesses = await listApprovalProcesses({apiKey, apiSecret});

		return { success: true, data: { networks, approvalProcesses } };
	},
} satisfies Actions;