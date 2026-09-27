import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
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
  const pageTitle = `${toCapitalize(
    title
  )} | Bolio UI - Amazing, modern and creative tools for React UI`

  return {
    title: toCapitalize(title),
    description,
    openGraph: {
      url: `/docs/${section}/${slug}`,
      title: pageTitle,
      description,
      images: [{ url: '/cover.jpg', width: 1200, height: 630, alt: pageTitle }]
    }
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { section, slug } = await params
  return <DocsContent section={section} slug={slug} />
}
