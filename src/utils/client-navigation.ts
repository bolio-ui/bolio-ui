import type { MouseEvent } from 'react'

// A plain left click navigates inside the app. A click with a modifier key keeps the
// browser behavior, such as opening the link in a new tab.
export const isPlainLeftClick = (event: MouseEvent) =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
