import type { GlobalState } from "../types";

/**
 * Unified state
 */
export const globalState = $state<GlobalState>({
  // indicates if user is authenticated.
  authenticated: false,

  // User credentials.
	credentials: {
		apiKey: '',
    apiSecret: '',
	},

  // Networks supported by Defender + tenant networks.
  networks: [],

  // Approval processes corresponding to current user
  approvalProcesses: [],

  // Current deployment form state.
  // TODO: define type
  form: {},
});