import { defenderAuth } from "$lib/server/defender";
import type { Actions } from "@sveltejs/kit";

export const actions = {
	authenticate: async ({ request }) => {
    const data = await request.formData();
    const apiKey = data.get('apiKey')?.toString();
		const apiSecret = data.get('apiSecret')?.toString();

		if (!apiKey || !apiSecret) {
			return { success: false, error: 'Missing API key or API secret' };
		}

		const usage = await defenderAuth(apiKey, apiSecret);

		return { success: true, data: usage };
	}
} satisfies Actions;