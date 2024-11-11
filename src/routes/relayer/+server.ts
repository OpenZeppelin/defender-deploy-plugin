import { createRelayer } from "$lib/defender";
import type { CreateRelayerRequest, Credentials } from "$lib/models/defender";
import { attempt } from "$lib/utils";
import { json } from '@sveltejs/kit';


export async function POST({ request }: { request: Request }) {
  const { relayer, credentials }: { credentials: Credentials, relayer: CreateRelayerRequest} = await request.json();

  // Creates a Relayer
  const [createdRelayer, error] = await attempt(() => createRelayer(credentials, relayer));
  if (error) {
    return json({ success: false, error });
  }

  return json({ success: true, data: { relayer: createdRelayer }  });
}