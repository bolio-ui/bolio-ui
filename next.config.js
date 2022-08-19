/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/
})

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  generateEtags: false,

  poweredByHeader: false,

  eslint: {
    ignoreDuringBuilds: true
  },

  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx'],

  cssModules: true,

  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]'
  },

  env: {
    VERSION: require('./package.json').version
  },

  pwa: {
    dest: 'public',
    disable: !isProd
  }
}

module.exports = withPWA(withMDX(nextConfig))
