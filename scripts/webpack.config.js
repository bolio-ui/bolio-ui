const fs = require('fs-extra')
const path = require('path')
const corePath = path.join(__dirname, '../core')

module.exports = async () => {
  const files = await fs.readdir(corePath)

  const core = await Promise.all(
    files.map(async (name) => {
      const comPath = path.join(corePath, name)
      const entry = path.join(comPath, 'index.ts')

      const stat = await fs.stat(comPath)
      if (!stat.isDirectory()) return null

      const hasFile = await fs.pathExists(entry)
      if (!hasFile) return null

      return { name, url: entry }
    })
  )

  const coreEntries = core
    .filter((r) => r)
    .reduce((pre, current) => {
      return Object.assign({}, pre, { [current.name]: current.url })
    }, {})

  console.log(
    `\n${
      Object.keys(coreEntries).length
    } Components in total have been collected.`
  )
  console.log('Bundle now...')

  const configs = {
    mode: 'none',

    entry: coreEntries,

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
      libraryTarget: 'commonjs'
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        core: corePath
      }
    },

    externals: [
      {
        react: {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react'
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom'
        }
      },
      function (context, request, done) {
        if (/^styled-jsx/.test(request)) {
          return done(null, 'commonjs ' + request)
        }
        done()
      }
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react', '@babel/typescript'],
            plugins: ['styled-jsx/babel']
          }
        }
      ]
    }
  }

  return [
    configs,
    {
      ...configs,

      entry: {
        index: path.join(corePath, 'index.ts')
      }
    },
    {
      ...configs,

      mode: 'production',

      entry: {
        'index.min': path.join(corePath, 'index.ts')
      },

      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        library: 'BolioUI',
        libraryTarget: 'umd',
        globalObject: 'this'
      }
    }
  ]
}
