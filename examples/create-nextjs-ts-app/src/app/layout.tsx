import type { Metadata } from 'next'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'
import '@bolio-ui/core/styles.css'

export const metadata: Metadata = {
  title: 'Bolio UI',
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <BolioUIProvider>
          <CssBaseline />
          {children}
        </BolioUIProvider>
      </body>
    </html>
  )
}
