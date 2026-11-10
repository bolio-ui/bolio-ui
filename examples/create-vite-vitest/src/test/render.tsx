import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@bolio-ui/core/styles.css'
import { BolioUIProvider } from '@bolio-ui/core'

// Bolio UI components read the theme from BolioUIProvider, and `useToasts`
// only works inside it, so every test renders through this wrapper.
export function renderWithBolio(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(<BolioUIProvider>{ui}</BolioUIProvider>)
  }
}
