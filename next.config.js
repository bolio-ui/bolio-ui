const withPWA = require('next-pwa')
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [
      require('@mapbox/rehype-prism'),
      require('rehype-join-line')
    ]
  }
})

const isProd = process.env.ENVIRONMENT === 'production'

const nextConfig = {
  target: 'serverless',
  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx'],
  pwa: {
    dest: 'public',
    disable: !isProd
  }
}

module.exports = withPWA(withMDX(nextConfig))
