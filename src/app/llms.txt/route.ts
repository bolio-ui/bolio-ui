import fs from 'fs'
import path from 'path'
import { generateStaticParams } from 'src/app/docs/[section]/[slug]/page'

export const dynamic = 'force-static'

const SITE = 'https://bolio-ui.com'
const SECTIONS = { guide: 'Guide', components: 'Components', hooks: 'Hooks' }

export const readDoc = (section: string, slug: string) =>
  fs.readFileSync(
    path.join(process.cwd(), 'src/content/docs', section, `${slug}.mdx`),
    'utf8'
  )

// The pages of the given sections in one text, for the llms-*.txt files that
// carry the docs themselves.
export const joinDocs = (sections: string[]) =>
  generateStaticParams()
    .filter(({ section }) => sections.includes(section))
    .map(({ section, slug }) => readDoc(section, slug))
    .join('\n\n---\n\n')

export const textResponse = (body: string) =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })

// The index for LLMs (llmstxt.org): one line per docs page, linking to its
// Markdown source served by /md.
export function GET() {
  const pages = generateStaticParams()
  const sections = Object.entries(SECTIONS).map(([section, title]) => {
    const links = pages
      .filter((page) => page.section === section)
      .map(({ slug }) => {
        const source = readDoc(section, slug)
        const name = source.match(/title: (['"])(.*?)\1/)?.[2] ?? slug
        const about = source.match(/description:\s*(['"])(.*?)\1/)?.[2]
        return `- [${name}](${SITE}/md/${section}/${slug})${about ? `: ${about}` : ''}`
      })
    return `## ${title}\n\n${links.join('\n')}`
  })
  const body = `# Bolio UI\n\n> Amazing, modern and creative tools for React UI. Docs for @bolio-ui/core, with the complete text in ${SITE}/llms-full.txt, ${SITE}/llms-components.txt (components and hooks) and ${SITE}/llms-guide.txt (guides).\n\n${sections.join('\n\n')}\n`
  return textResponse(body)
}
