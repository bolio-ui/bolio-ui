import type { Metadata } from 'next'
import NotFound from 'src/templates/NotFound'

export const metadata: Metadata = {
  title: '404: Page not found'
}

export default function Page() {
  return <NotFound />
}
