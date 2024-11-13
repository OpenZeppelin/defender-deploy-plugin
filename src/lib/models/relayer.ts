/**
 * Relayer models (simplified)
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/relay/src/models/index.ts
 */
export type BigUInt = string | number;
export interface CreateRelayerRequest {
  name: string;
  network: string;
  minBalance: BigUInt;
}

export interface Relayer {
  relayerId: string;
  name: string;
  address: string;
  network: string;
  paused: boolean;
  pendingTxCost: string;
  minBalance: BigUInt;
}