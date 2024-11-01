
import { AccountClient } from '@openzeppelin/defender-sdk-account-client'

export const defenderAuth = async (apiKey: string, apiSecret: string) => {
  const account = new AccountClient({ apiKey, apiSecret })
  const usage = account.getUsage();
  return usage;
}