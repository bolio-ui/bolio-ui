/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/
})

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  pwa: {
    dest: 'public',
    disable: !isProd
  }
}

module.exports = withPWA(withMDX(nextConfig))
