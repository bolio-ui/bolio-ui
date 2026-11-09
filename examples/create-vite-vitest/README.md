# Vite and Vitest example for Bolio UI

A [Vite](https://vite.dev) application with React and TypeScript, and tests written with [Vitest](https://vitest.dev) and Testing Library.

## Getting started

```bash
yarn
yarn dev
```

Run the tests:

```bash
yarn test
```

What to look at:

- `src/test/render.tsx` renders a component inside `BolioUIProvider`, which Bolio UI components and `useToasts` need.
- `src/test/setup.ts` adds the Testing Library matchers and a `ResizeObserver` stub, which jsdom does not have.
- `src/App.test.tsx` tests an `Input` with an error, a `Modal` and a toast.

See the [Testing with Vitest guide](https://bolio-ui.com/docs/guide/testing-with-vitest) to set this up in your own project.
