/** @jest-environment node */
import fs from 'fs'
import path from 'path'
import { GET as index } from 'src/app/llms.txt/route'
import { GET as full } from 'src/app/llms-full.txt/route'
import { GET as components } from 'src/app/llms-components.txt/route'
import { GET as guide } from 'src/app/llms-guide.txt/route'
import manifest from 'src/content/docs/manifest.json'

const text = (route: () => Response) => route().text()
const pages = (section: string) =>
  fs
    .readdirSync(path.join(process.cwd(), 'src/content/docs', section))
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))

type Route = { path?: string; routes?: Array<Route> }
const manifestPaths = (routes: Array<Route>): Array<string> =>
  routes.flatMap((route) =>
    route.path ? [route.path] : manifestPaths(route.routes ?? [])
  )

describe('llms.txt', () => {
  it('links every docs page to its Markdown source', async () => {
    const body = await text(index)
    ;['guide', 'components', 'hooks'].forEach((section) =>
      pages(section).forEach((slug) =>
        expect(body).toContain(`](https://bolio-ui.com/md/${section}/${slug})`)
      )
    )
  })

  it('has a page for every entry of the sidebar manifest', async () => {
    const body = await text(index)
    manifestPaths(manifest.routes as Array<Route>).forEach((file) => {
      const [, section, slug] = file
        .replace(/\.mdx$/, '')
        .split('/')
        .slice(1)
      expect(body).toContain(`/md/${section}/${slug})`)
    })
  })

  it('names every page and gives it a description', async () => {
    const body = await text(index)
    expect(body.startsWith('# Bolio UI\n')).toBe(true)
    expect(body).toContain('- [About Bolio UI](')
    expect(body).toContain('Bolio UI is a dedicated library')
  })

  it('is plain text', () => {
    expect(index().headers.get('Content-Type')).toContain('text/plain')
  })
})

describe('llms-*.txt', () => {
  it('llms-full.txt carries guides, components and hooks', async () => {
    const body = await text(full)
    expect(body).toContain("title: 'Getting Started'")
    expect(body).toContain("title: 'Button'")
    expect(body).toContain("title: 'useTheme'")
  })

  it('llms-components.txt has components and hooks, not guides', async () => {
    const body = await text(components)
    expect(body).toContain("title: 'Button'")
    expect(body).toContain("title: 'useTheme'")
    expect(body).not.toContain("title: 'Getting Started'")
  })

  it('llms-guide.txt has the guides only', async () => {
    const body = await text(guide)
    expect(body).toContain("title: 'Getting Started'")
    expect(body).not.toContain("title: 'Button'")
  })

  it('the index links the others', async () => {
    const body = await text(index)
    ;['full', 'components', 'guide'].forEach((name) =>
      expect(body).toContain(`/llms-${name}.txt`)
    )
  })
})
