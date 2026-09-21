# @bolio-ui/cli

Set up Bolio UI in your project with one command.

```bash
npx @bolio-ui/cli init
```

It installs `@bolio-ui/core` with your package manager and wraps your app with `BolioUIProvider`.

Add `--icons` to also install `@bolio-ui/icons`.

## Supported frameworks

| Framework                          | File updated                                          |
| ---------------------------------- | ----------------------------------------------------- |
| Next.js (App Router)               | `app/layout` or `src/app/layout`                      |
| Next.js (Pages Router)             | `pages/_app` or `src/pages/_app` (created if missing) |
| Vite and React Router (library)    | `src/main`                                            |
| Remix and React Router (framework) | `app/root`                                            |
| Gatsby                             | `gatsby-browser` and `gatsby-ssr` (created)           |
| Redwood                            | `web/src/App`                                         |

When the file does not have the expected code, the command prints what to add instead of editing it. See the [getting started guide](https://bolio-ui.com/guide/getting-started) for the manual setup.
