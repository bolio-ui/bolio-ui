import type React from 'react'

// Enter and Space press a clickable element that is not a button, as they do
// on a button. Keys that bubble up from a control inside it are left alone.
export const activateOnKey = (event: React.KeyboardEvent<HTMLElement>) => {
  if (event.target !== event.currentTarget) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  event.currentTarget.click()
}
