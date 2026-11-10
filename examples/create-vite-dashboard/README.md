# Vite dashboard example for Bolio UI

A [Vite](https://vite.dev) application with React and TypeScript that puts several Bolio UI components together in one page: stat tiles with a sparkline, an area chart, a donut chart, a ranked list, a schedule, and modals opened from code.

## Getting started

```bash
yarn
yarn dev
```

What to look at:

- `src/App.tsx` imports the charts from `@bolio-ui/core/charts`. They need the [recharts](https://recharts.org) package, which is in `package.json`, and everything else comes from `@bolio-ui/core`.
- `src/main.tsx` wraps the app in `ModalsProvider`, so any component can call `useModals()` to open a modal or a confirm dialog.
- `src/data.ts` has the sample data. The schedule events are built around today.

See the [Vite guide](https://bolio-ui.com/docs/guide/bolio-ui-plus-vite) to set up Bolio UI in your own project.
