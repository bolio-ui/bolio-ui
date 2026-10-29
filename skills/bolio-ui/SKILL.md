---
name: bolio-ui
description: Build React interfaces with Bolio UI (@bolio-ui/core). Use when the task imports from @bolio-ui/core, mentions Bolio UI, or needs components, hooks or themes from it.
---

# Bolio UI

Bolio UI is a React component library (`@bolio-ui/core`, v3). The docs are published as Markdown, so read them instead of guessing props.

## Docs

- Index of every page: https://bolio-ui.com/llms.txt
- All docs in one file: https://bolio-ui.com/llms-full.txt
- One page as Markdown: `https://bolio-ui.com/md/<section>/<slug>`, where section is `guide`, `components` or `hooks` (for example `/md/components/button`)

## Setup

1. Install with `npx @bolio-ui/cli@latest init`, or `npm install @bolio-ui/core`. To copy the source of a component into the project instead, run `npx @bolio-ui/cli@latest add <component>`, and skip the stylesheet import below.
2. Import `@bolio-ui/core/styles.css` once and wrap the app with `BolioUIProvider` and `CssBaseline`.
3. See https://bolio-ui.com/md/guide/getting-started for each framework.

## Rules

- Open the page of a component before using it. Props, variants and examples are there.
- Import from `@bolio-ui/core`. Do not copy component code.
- Take colors from the theme (`useTheme`), never hardcode hex values.
- Coming from v2? Read https://bolio-ui.com/md/guide/migration-v2-to-v3 first.
