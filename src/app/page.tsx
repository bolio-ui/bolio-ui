import JsonLd from 'src/components/JsonLd'
import Home from 'src/templates/Home'

const site = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Bolio UI',
  url: 'https://bolio-ui.com',
  description:
    'Amazing, modern and creative tools for React UI. Components, hooks and themes with clear documentation.',
  inLanguage: 'en'
}

export default function Page() {
  return (
    <>
      <JsonLd data={site} />
      <Home />
    </>
  )
}
