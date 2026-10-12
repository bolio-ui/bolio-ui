import type { MetadataRoute } from 'next'
import { generateStaticParams } from 'src/app/docs/[section]/[slug]/page'

const SITE = 'https://bolio-ui.com'

// Every docs page comes from the same folder that builds the site, so a new
// page is in the sitemap on the next build.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/theme-generator'
  ].concat(
    generateStaticParams().map(
      ({ section, slug }) => `/docs/${section}/${slug}`
    )
  )
  return pages.map((page) => ({ url: `${SITE}${page}` }))
}
