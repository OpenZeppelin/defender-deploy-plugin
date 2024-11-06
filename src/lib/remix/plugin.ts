// place files you want to import through the `$lib` alias in this folder.
import { PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-iframe";
import { listenOnThemeChanged } from "./hacks";

export const initPlugin = () => {
  const plugin = new PluginClient({allowOrigins: ['https://remix.ethereum.org']});
  const client = createClient(plugin);
  listenOnThemeChanged(client);
}