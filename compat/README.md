# Compat matrix

Small Next.js app used to check that the **packed** `@bolio-ui/core` builds and
renders under different Next/React versions. It covers three entry points:

| Route         | Router / kind                              |
| ------------- | ------------------------------------------ |
| `/`           | Pages Router                               |
| `/app-client` | App Router, page marked `'use client'`     |
| `/app-server` | App Router, Server Component (no directive) |

## Run

```bash
yarn build:clear && yarn build:rollup && yarn build:babel && yarn build:after
npm pack --pack-destination /tmp/bolio-pack
PACK_DIR=/tmp/bolio-pack compat/run.sh <next-version> <react-version> [port]

# examples
PACK_DIR=/tmp/bolio-pack compat/run.sh 15 19
PACK_DIR=/tmp/bolio-pack compat/run.sh 16 19
PACK_DIR=/tmp/bolio-pack compat/run.sh 14 18
```

(`build:types` is skipped on purpose while it is broken on Node 24.)

For each route the script prints the HTTP status, how many `<style>` tags reach
the server-rendered HTML and how many `jsx-*` classes appear. `jsx-*` classes with
zero `<style>` tags means the page is served unstyled and only gets CSS after
hydration.

Working files live in `compat/.work/` (git-ignored).
