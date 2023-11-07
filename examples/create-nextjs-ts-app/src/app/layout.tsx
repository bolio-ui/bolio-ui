'use client'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <CssBaseline />
        <title>Bolio UI</title>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <BolioUIProvider>{children}</BolioUIProvider>
      </body>
    </html>
  )
}
