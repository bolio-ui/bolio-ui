import type { Metadata } from 'next'
import FaqTemplate from 'src/templates/Faq'

export const metadata: Metadata = {
  title: { absolute: 'FAQ - Bolio UI' },
  description:
    'Answers to the questions people ask most about Bolio UI: install, styles, themes, frameworks, accessibility and migrating to v3.'
}

export default function Page() {
  return <FaqTemplate />
}
