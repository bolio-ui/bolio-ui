# Vite and Storybook example for Bolio UI

A [Vite](https://vite.dev) application with React and TypeScript, and [Storybook](https://storybook.js.org) to build and review components with Bolio UI.

## Getting started

```bash
yarn
yarn dev
```

Open Storybook:

```bash
yarn storybook
```

What to look at:

- `.storybook/preview.tsx` wraps every story in `BolioUIProvider` and `CssBaseline`, imports the stylesheet once and adds a light and dark theme switch to the toolbar.
- `.storybook/main.ts` loads the Docs and Accessibility add-ons.
- `src/StatusCard.stories.tsx` is a story with controls for the props of a component.

See the [Storybook guide](https://bolio-ui.com/docs/guide/storybook) to set this up in your own project.
