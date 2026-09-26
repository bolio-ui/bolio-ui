import { createRequire } from 'module'
import createMDX from '@next/mdx'
import { withSerwist } from '@serwist/turbopack'

const require = createRequire(import.meta.url)

// MDX 3 does not read tables and strikethrough by itself: remark-gfm restores them.
// The plugins are given by name, which is how @next/mdx loads ESM plugins.
// The components used by every MDX page come from src/mdx-components.tsx.
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['@mapbox/rehype-prism', 'rehype-join-line']
  }
})

const nextConfig = {
  env: {
    NEXT_PUBLIC_VERSION: require('./package.json').version
  },
  devIndicators: false,
  // .mdx here also makes the MDX files use the React that ships with the App Router
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // each docs section opens on its first page
  async redirects() {
    return [
      ['/docs', '/docs/guide/getting-started'],
      ['/docs/guide', '/docs/guide/getting-started'],
      ['/docs/components', '/docs/components/avatar'],
      ['/docs/hooks', '/docs/hooks/use-body-scroll']
    ].map(([source, destination]) => ({
      source,
      destination,
      permanent: false
    }))
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
              font-src 'self' https:;
              object-src 'none';
              base-uri 'self';
              frame-ancestors 'none';
            `
              .replace(/\s{2,}/g, ' ')
              .trim()
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}

export default withSerwist(withMDX(nextConfig))
