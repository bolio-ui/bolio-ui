const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [
      require('@mapbox/rehype-prism'),
      require('rehype-join-line')
    ]
  }
})

const nextConfig = {
  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx']
}

module.exports = withMDX(nextConfig)
