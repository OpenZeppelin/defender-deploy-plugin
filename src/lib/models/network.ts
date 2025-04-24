/**
 * Network mappings for Defender
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/base/src/utils/network.ts
 */

export interface TenantNetworkResponse {
  tenantNetworkId: string;
  name: string;
  chainId: number;
  networkType: 'private' | 'fork';
  isProduction?: boolean;
}

export interface NetworkResponse {
  name: string;
  displayName?: string;
  symbol: string;
  chainId: number;
  networkType: 'native';
  isProduction: boolean;
}


export function isProductionNetwork(network: NetworkResponse | TenantNetworkResponse): boolean {
  return network.isProduction ?? false;
}

export function getNetworkLiteral(network: NetworkResponse | TenantNetworkResponse): string {
  return network.name;
}

export function isTenantNetwork(network: NetworkResponse | TenantNetworkResponse): network is TenantNetworkResponse {
  return "tenantNetworkId" in network
}

export function isNativeNetwork(network: NetworkResponse | TenantNetworkResponse): network is NetworkResponse {
  return  network.networkType === "native"
}

export function getNetworkDisplayName(network: NetworkResponse | TenantNetworkResponse) {
  return (isNativeNetwork(network) ? network.displayName : network.name) || network.name
}
