# Compat matrix

Small Next.js app used to check that the **packed** `@bolio-ui/core` builds and
renders under different Next/React versions. It covers three entry points:

| Route         | Router / kind                               |
| ------------- | ------------------------------------------- |
| `/`           | Pages Router                                |
| `/app-client` | App Router, page marked `'use client'`      |
| `/app-server` | App Router, Server Component (no directive) |

## Run

```bash
yarn build:package
npm pack --pack-destination /tmp/bolio-pack
PACK_DIR=/tmp/bolio-pack compat/run.sh <next-version> <react-version> [port]

# examples
PACK_DIR=/tmp/bolio-pack compat/run.sh 15 19
PACK_DIR=/tmp/bolio-pack compat/run.sh 16 19
PACK_DIR=/tmp/bolio-pack compat/run.sh 14 18
```

For each route the script prints the HTTP status, how many `<style>` tags reach
the server-rendered HTML and how many `jsx-*` classes appear. `jsx-*` classes with
zero `<style>` tags means the page is served unstyled and only gets CSS after
hydration.

Working files live in `compat/.work/` (git-ignored).

## Styles of the package against the source

`compat/run.sh` only checks that the pages build and that styles reach the HTML.
It cannot tell a component that looks wrong, which is how 3.0.0 shipped with the
rules of `CssBaseline` outside the CSS layers, overriding the components.

```bash
compat/compare-styles.sh
# or with a tarball you already have
PACK_DIR=/tmp/bolio-pack compat/compare-styles.sh
```

It builds one page with the default case of every component (the list of
`core/__tests__/cases.tsx`) twice, with Vite: against the packed tarball and its
`styles.css`, and against `core/` as plain CSS Modules. Then it compares the
computed style of every element in the light and the dark theme, with animations
off. It prints the components that differ and exits with 1 if there is any. It
needs Google Chrome. A new component is covered as soon as it has a case in
`cases.tsx`.
