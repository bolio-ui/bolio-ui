import { BolioUIProvider, CssBaseline } from '../core'
import ToastContainer from '../core/use-toasts/toast-container'

export const decorators = [
  (Story) => (
    <BolioUIProvider>
      <CssBaseline />
      <Story />
      <ToastContainer />
    </BolioUIProvider>
  )
]

// Storybook 6 showed a Docs page for every component; it is opt-in since 7
export const tags = ['autodocs']
