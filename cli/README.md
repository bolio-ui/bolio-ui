# @bolio-ui/cli

Set up Bolio UI with one command, in a new project or in one you already have.

```bash
# a new project
pnpm dlx @bolio-ui/cli@latest init my-app -t next
# or
npx @bolio-ui/cli@latest init my-app -t next
# or
yarn dlx @bolio-ui/cli@latest init my-app -t next
# or
bunx --bun @bolio-ui/cli@latest init my-app -t next

# the project of the current folder
pnpm dlx @bolio-ui/cli@latest init
# or
npx @bolio-ui/cli@latest init
# or
yarn dlx @bolio-ui/cli@latest init
# or
bunx --bun @bolio-ui/cli@latest init
```

It installs `@bolio-ui/core` with your package manager and wraps your app with `BolioUIProvider`.

## Options

| Option             | What it does                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `[name]`           | folder of the new project, with `-t`                                                                              |
| `-t`, `--template` | create a new project: `next`, `vite`, `react-router`, `gatsby`, `redwood`, `tanstack`, `waku`, `rwsdk` or `astro` |
| `--icons`          | also install `@bolio-ui/icons`                                                                                    |
| `-y`, `--yes`      | do not ask anything                                                                                               |

Without `-t`, in a folder with no project, the command asks which template to use. In a terminal it also asks if you want `@bolio-ui/icons`.

Each template runs the generator of the framework (`create-next-app`, `create-vite`, `create-react-router`, `create-gatsby`, `create-redwood-app`, `@tanstack/cli`, `create-waku`, `create-rwsdk` and `create-astro`) with `npx`, then sets up Bolio UI in the new project. Redwood needs Node 20 and Corepack; the command stops with a hint when the Node version is different. Astro needs Node 22 or newer.

## Supported frameworks

| Framework                          | File updated                                          |
| ---------------------------------- | ----------------------------------------------------- |
| Next.js (App Router)               | `app/layout` or `src/app/layout`                      |
| Next.js (Pages Router)             | `pages/_app` or `src/pages/_app` (created if missing) |
| Vite and React Router (library)    | `src/main`                                            |
| Remix and React Router (framework) | `app/root`                                            |
| Gatsby                             | `gatsby-browser` and `gatsby-ssr` (created)           |
| Redwood                            | `web/src/App`                                         |
| TanStack Start                     | `src/routes/__root`                                   |
| Waku                               | `src/pages/_layout`                                   |
| RedwoodSDK                         | `src/app/document`                                    |
| Astro                              | `src/components/BolioUI` (created, wraps each island) |

When a file does not have the expected code, the command prints what to add instead of editing it, and running it again changes nothing. See the [getting started guide](https://bolio-ui.com/docs/guide/getting-started) for the manual setup.
