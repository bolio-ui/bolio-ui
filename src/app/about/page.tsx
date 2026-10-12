import type { Metadata } from 'next'
import InfoTemplate from 'src/templates/Info'

export const metadata: Metadata = {
  title: { absolute: 'About - Bolio UI' },
  description:
    'Bolio UI is an open source React component library with accessible components, static CSS and themes you can customize.'
}

export default function Page() {
  return (
    <InfoTemplate
      eyebrow="About"
      title="Tools for React UI that stay out of your way"
      intro="Bolio UI is an open source library of accessible React components, built to be easy to customize and clear to learn."
      sections={[
        {
          title: 'What it is',
          body: 'A set of components, hooks and themes for React 18 and 19. Styles ship as static CSS, so there is no runtime injection and no registry to set up.'
        },
        {
          title: 'What guides it',
          body: 'Accessibility comes first: components follow the WAI-ARIA patterns and work with the keyboard. Every component is documented with a live example you can copy.'
        },
        {
          title: 'Open source',
          body: 'Bolio UI is released under the MIT license. Read the code, open an issue or send a fix on GitHub.'
        }
      ]}
    />
  )
}
