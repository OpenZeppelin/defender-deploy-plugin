// place files you want to import through the `$lib` alias in this folder.
import { PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-iframe";
import type { Theme } from "@remixproject/plugin-api";

/**
 * This is a hack to allow Remix to inject the theme css into the iframe
 * https://github.com/ethereum/remix-plugin/issues/472
 */
async function listenOnThemeChanged(client: PluginClient) {
  const cssLink = document.createElement('link')
  cssLink.setAttribute('rel', 'stylesheet')
  document.head.prepend(cssLink)
  
  client.onload(async () => {
    client.on('theme', 'themeChanged', (_theme: Theme) => setTheme(cssLink, _theme))
    const theme = await client.call('theme', 'currentTheme')
    setTheme(cssLink, theme)
  })
  return cssLink
}

function setTheme(cssLink: HTMLLinkElement, theme: Theme) {
  cssLink.setAttribute('href', theme.url!)
  document.documentElement.style.setProperty('--theme', theme.quality!)
}

export const initPlugin = () => {
  const plugin = new PluginClient({allowOrigins: ['https://remix.ethereum.org']});
  const client = createClient(plugin);
  listenOnThemeChanged(client);
}