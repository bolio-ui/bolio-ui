import { StyledJsxRegistry } from '@bolio-ui/core/next'

export const metadata = { title: 'Bolio UI compat' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
