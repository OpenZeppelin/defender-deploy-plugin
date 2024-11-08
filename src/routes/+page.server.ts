import { listApprovalProcesses, listNetworks } from "$lib/defender";
import type { Credentials } from "$lib/models/defender";
import { error, type  Actions } from "@sveltejs/kit";


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

		try {
			// List netorks to preload network selection
			const networks = await listNetworks({ apiKey, apiSecret });

			// List approval processes to preload approval process selection
			const approvalProcesses = await listApprovalProcesses({ apiKey, apiSecret });
			return { success: true, data: { networks, approvalProcesses, credentials: { apiKey, apiSecret } } };
		} catch (err) {
			return { success: true, data: { error: (err as Error).message } }
		}
	},
} satisfies Actions;