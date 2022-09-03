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
