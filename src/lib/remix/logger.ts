import type { CustomApi } from "@remixproject/plugin-utils";
import type { ITerminal } from "@remixproject/plugin-api/src/lib/terminal";

let terminal: CustomApi<ITerminal> | null = null;

export const initLogger = (term: CustomApi<ITerminal>) => {
  terminal = term;
}

export const logError = (msg: string) => {
  if (!terminal) throw new Error('Terminal not initialized');
  terminal?.log({ type: 'error', value: msg });
}

export const logSuccess = (msg: string) => {
  if (!terminal) throw new Error('Terminal not initialized');
  terminal?.log({ type: 'info', value: msg });
}

export const log = (msg: string) => {
  if (!terminal) throw new Error('Terminal not initialized');
  terminal?.log({ type: 'log', value: msg });
}