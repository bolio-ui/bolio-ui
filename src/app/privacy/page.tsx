import type { Metadata } from 'next'
import InfoTemplate from 'src/templates/Info'

export const metadata: Metadata = {
  title: { absolute: 'Privacy - Bolio UI' },
  description:
    'How bolio-ui.com uses analytics only after you accept, and what it stores in your browser.'
}

export default function Page() {
  return (
    <InfoTemplate
      eyebrow="Privacy"
      title="Your privacy on Bolio UI"
      intro="This site collects almost nothing, and analytics only runs if you say yes."
      sections={[
        {
          title: 'Analytics',
          body: 'We use Google Analytics to count visits and see which pages help. It stays off until you accept the banner. If you decline, nothing is sent.'
        },
        {
          title: 'What stays in your browser',
          body: 'Your theme choice and your consent answer are saved in local storage. They never leave your device.'
        },
        {
          title: 'Accounts and forms',
          body: 'There is no sign in, and we do not ask for your name or email on this site.'
        },
        {
          title: 'Changing your mind',
          body: 'Clear the site data in your browser to see the consent banner again.'
        }
      ]}
    />
  )
}
