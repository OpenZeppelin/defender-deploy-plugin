<p align="center">
  <img src="./src/docs/banner.png" width="100%" alt="OpenZeppelin Logo">
</p>

# Defender Deploy Plugin

Plugin to deploy smart contracts using OpenZeppelin Defender. Currently supported in:

- [Remix IDE](https://remix.ethereum.org/) - As a plugin listed in plugins directory, for more information please visit [our docs](https://docs.openzeppelin.com/defender/remix-plugin).
- [Contracts Wizard](https://wizard.openzeppelin.com/) - Integrated in code editor, for more information please visit [our docs](https://docs.openzeppelin.com/defender/remix-plugin).

## Getting Started

```bash
# install deps
pnpm install

# run locally
pnpm dev
```

NOTE: This project is meant to be embedded in other UIs, just running the project won't be enough to see and debug it. You must embed the UI on an external iframe.

## Testing in Remix

1. Go to (https://remix.ethereum.org/)[Remix IDE].
2. Click on Plugin Manager (bottom left corner - above settings).
3. At the top, click on `Connect to a Local Plugin` button.
4. Set following values
```bash
Plugin Name: defender
Display Name: Defender Deploy
Url: http://localhost:5173 # or live version https://defeder-remix-deploy.netlify.app/
Type of connection: Iframe
Location in Remix: Side Panel
```
5. You should see the plugin added to the sidebar (new icon with ? symbol).

## Testing in Contracts Wizard

For testing in Contracts Wizard, you must also run the Contracts Wizard UI locally to point to your local plugin.

1. Run Contracts Wizard locally.
 - a. Go to [https://github.com/OpenZeppelin/contracts-wizard](Contracts Wizard Repo).
 - b. Clone the latest `master` branch and follow steps to setup the project.
 - c. Move to `pacakges/ui` and run it with `yarn dev`.
2. In another terminal, run this project using `pnpm dev`, make sure the app is served in `http://localhost:5173`.
3. Open Contracts Wizard local UI, generally in `http://localhost:8080`.
4. Click on "Deploy with Defender" button, you should be able to see embedded the local plugin.

## Development

Many parts of codebase are shared across plugins (server side code, state definition, ethereum interactions, etc.), but UI components have a separated implementation to make them more flexible and prevent side-effects.

We have some bootstrap logic to expose one UI or another depending on the parent iframe domain.

### Remix
The entrypoint for Remix plugin is `src/routes/remix.svelte`. Its components mainly use [bootstrap](https://getbootstrap.com/) for styling, Remix UI injects bootstrap dependency as a <link> html tag when embedded.

### Wizard
The entrypoint for Contracts Wizard plugin is `src/routes/wizard.svelte`. Its components mainly use [tailwind CSS](https://tailwindcss.com/) for styling, this is mainly for convenience, since Contracts Wizard was made using this CSS framework.

## Release

The repo has a CI/CD connected to our netlify account, when we merge `main` to some of the release branches, a new version of the plugin is released to live. Branches:

- Remix IDE Plugin - `release-remix`
- Contracts Wizard Plugin - `release-wizard`

> [!WARNING]
> We use `main` branch as the single source of truth and it's the only branch allowed to be merged to release branches. It should be tested carefully before triggering a new release.