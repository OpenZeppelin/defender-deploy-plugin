import type { PluginClient } from "@remixproject/plugin"
import type { Theme } from "@remixproject/plugin-api"

/**
 * This is a hack to allow Remix to inject the theme css into the iframe
 * https://github.com/ethereum/remix-plugin/issues/472
 */
export async function listenOnThemeChanged(client: PluginClient) {
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