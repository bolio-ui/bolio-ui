import type { Metadata } from 'next'
import ContactTemplate from 'src/templates/Contact'

export const metadata: Metadata = {
  title: { absolute: 'Contact - Bolio UI' },
  description:
    'Report a bug, suggest a feature or ask a question about Bolio UI on GitHub, Twitter or Instagram.'
}

export default function Page() {
  return <ContactTemplate />
}
