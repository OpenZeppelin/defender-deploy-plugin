import type { GlobalState } from "../models/utils";

/**
 * Global application state
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
  form: {
    // Network selected to deploy
    network: undefined,

    // User selected approval process
    approvalProcess: undefined,
  },
});