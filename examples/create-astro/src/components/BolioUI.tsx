import '@bolio-ui/core/styles.css'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'
import type { ReactNode } from 'react'

export default function BolioUI({ children }: { children: ReactNode }) {
  return (
    <BolioUIProvider>
      <CssBaseline />
      {children}
    </BolioUIProvider>
  )
}
