import { PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-iframe";
import { listenOnThemeChanged } from "./theme";
import { listenOnCompilerResults } from "./compiler";
import { initLogger } from "./logger";

export const initRemixPlugin = () => {
  const plugin = new PluginClient({ allowOrigins: ['https://remix.ethereum.org'] });
  const client = createClient(plugin);

  // when users select a new theme, the plugin adopts new styles.
  listenOnThemeChanged(client);

  // when users compile a contract, the plugin gets the results.
  listenOnCompilerResults(client);

  // creates a logger instance.
  initLogger(client.terminal);
}