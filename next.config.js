// MDX 3 does not read tables and strikethrough by itself: remark-gfm restores them.
// The plugins are given by name, which is how @next/mdx loads ESM plugins.
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['@mapbox/rehype-prism', 'rehype-join-line']
  }
})

const withPWA = require('next-pwa')({
  dest: 'public',
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: process.env.ENVIRONMENT === 'develop',
  skipWaiting: true
})

const nextConfig = {
  env: {
    NEXT_PUBLIC_VERSION: require('./package.json').version
  },
  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx'],
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
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
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

module.exports = withPWA(withMDX(nextConfig))
