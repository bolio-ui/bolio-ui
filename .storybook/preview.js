import { BolioUIProvider, CssBaseline } from '../core'

export const decorators = [
  (Story) => (
    <BolioUIProvider>
      <CssBaseline />
      <Story />
    </BolioUIProvider>
  )
]
