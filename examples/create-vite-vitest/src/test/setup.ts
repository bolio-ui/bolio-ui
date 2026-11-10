import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Testing Library only cleans up on its own when the test runner has global
// hooks. This project keeps them off, so unmount after each test here.
afterEach(cleanup)

// jsdom has no ResizeObserver, and components that measure an element, such
// as ScrollArea, use it. A stub is enough because jsdom has no layout anyway.
if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}
