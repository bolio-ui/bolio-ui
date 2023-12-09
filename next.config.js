const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [
      require('@mapbox/rehype-prism'),
      require('rehype-join-line')
    ]
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
  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx']
}

module.exports = withPWA(withMDX(nextConfig))
