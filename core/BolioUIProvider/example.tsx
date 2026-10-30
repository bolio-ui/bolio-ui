import type { ReactNode } from 'react'
import CssBaseline from '../CssBaseline'
import BolioUIProvider from '.'

export default function Example({ children }: { children: ReactNode }) {
  return (
    <BolioUIProvider>
      <CssBaseline />
      {children}
    </BolioUIProvider>
  )
}
