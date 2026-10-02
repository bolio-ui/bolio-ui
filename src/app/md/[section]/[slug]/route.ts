import fs from 'fs'
import path from 'path'
import { generateStaticParams } from 'src/app/docs/[section]/[slug]/page'

export { generateStaticParams }
export const dynamicParams = false

// The source of a docs page, for "View as Markdown", "Copy Markdown" and the
// AI links. Section and slug come from generateStaticParams, so no other
// path can be requested.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string; slug: string }> }
) {
  const { section, slug } = await params
  const source = fs.readFileSync(
    path.join(process.cwd(), 'src/content/docs', section, `${slug}.mdx`),
    'utf8'
  )
  return new Response(source, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  })
}
