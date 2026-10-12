import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import JsonLd from 'src/components/JsonLd'
import { DocsContent, Meta } from 'src/templates/Docs'
import { toCapitalize } from 'src/utils/to-capitalize'

type Params = { section: string; slug: string }

// Every .mdx file in src/content/docs/<section> is a page
const DOCS_DIR = path.join(process.cwd(), 'src/content/docs')
const SECTIONS = ['guide', 'components', 'hooks']

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return SECTIONS.flatMap((section) =>
    fs
      .readdirSync(path.join(DOCS_DIR, section))
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => ({ section, slug: file.replace(/\.mdx$/, '') }))
  )
}

// The MDX runs in the browser (it uses hooks), so the meta for the <head> is
// read from the file itself: the `export const meta = { ... }` object literal.
const readMeta = ({ section, slug }: Params): Partial<Meta> => {
  const source = fs.readFileSync(
    path.join(DOCS_DIR, section, `${slug}.mdx`),
    'utf8'
  )
  const match = source.match(/export const meta = (\{[\s\S]*?\n\})/)
  return match ? new Function(`return ${match[1]}`)() : {}
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { section, slug } = await params
  const { title = '', description } = readMeta({ section, slug })
  const pageTitle = `${toCapitalize(title)} | Bolio UI`

  return {
    title: toCapitalize(title),
    description,
    alternates: { canonical: `/docs/${section}/${slug}` },
    openGraph: {
      url: `/docs/${section}/${slug}`,
      title: pageTitle,
      description,
      images: [{ url: '/cover.jpg', width: 1200, height: 630, alt: pageTitle }]
    }
  }
}

const SITE = 'https://bolio-ui.com'
const SECTION_NAMES: Record<string, string> = {
  guide: 'Guide',
  components: 'Components',
  hooks: 'Hooks'
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { section, slug } = await params
  const { title = '', description } = readMeta({ section, slug })
  const url = `${SITE}/docs/${section}/${slug}`
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: toCapitalize(title),
        description,
        url,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: 'Bolio UI', url: SITE }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { name: 'Bolio UI', item: SITE },
          { name: SECTION_NAMES[section], item: `${SITE}/docs/${section}` },
          { name: toCapitalize(title), item: url }
        ].map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...crumb
        }))
      }
    ]
  }

  return (
    <>
      <JsonLd data={data} />
      <DocsContent section={section} slug={slug} />
    </>
  )
}
