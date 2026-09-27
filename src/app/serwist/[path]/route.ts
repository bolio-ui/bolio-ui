import { createSerwistRoute } from '@serwist/turbopack'

// Turbopack has no build-time webpack plugin, so the service worker and its
// precache manifest are built here instead, at /serwist/sw.js. Registered
// client-side by SerwistProvider in src/app/providers.tsx.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: 'src/app/sw.ts',
    // defaults to esbuild-wasm outside Windows; native esbuild is already a
    // dependency (tsup uses it) and faster
    useNativeEsbuild: true
  })
