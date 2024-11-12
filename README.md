# Deploy with Defender - Remix Plugin

Remix plugin to deploy smart contracts using OpenZeppelin Defender.

## Getting Started

```bash
# install deps
pnpm install

# run locally
pnpm dev
```

The interface is ugly, but don't worry! it's not meant to be used directly, it's used embedded in a Remix iframe instead, and adopts its styles.

## Testing in Remix

1. Go to https://remix.ethereum.org/
2. Click on plugin manager.
3. At the top, click on `Connect to a Local Plugin` button.
4. Set following values
```bash
Plugin Name: defender
Display Name: Defender Deploy
Url: http://localhost:5173
Type of connection: Iframe
Location in Remix: Side Panel
```
5. You should see the plugin added to the sidebar.