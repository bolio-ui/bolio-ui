import { readFile } from 'fs/promises'
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { transformAsync } from '@babel/core'
import { defineConfig, type Options } from 'tsup'

// One entry for the package and one per folder, so `@bolio-ui/core/esm/Button`
// and `@bolio-ui/core/dist/Button` keep working
const entry: Record<string, string> = { index: 'core/index.ts' }
for (const name of readdirSync('core')) {
  const file = join('core', name, 'index.ts')
  if (existsSync(file)) entry[`${name}/index`] = file
}

// esbuild does not know styled-jsx, so `<style jsx>` and `css` from
// styled-jsx/css go through its babel plugin first. TS and JSX are kept as
// they are and compiled by esbuild afterwards.
const styledJsx: NonNullable<Options['esbuildPlugins']>[number] = {
  name: 'styled-jsx',
  setup(build) {
    build.onLoad({ filter: /core[\\/].*\.tsx?$/ }, async ({ path }) => {
      const source = await readFile(path, 'utf8')
      if (!/<style[^>]*\bjsx\b|styled-jsx\/css/.test(source)) return undefined
      const result = await transformAsync(source, {
        filename: path,
        babelrc: false,
        configFile: false,
        plugins: [
          ['@babel/plugin-syntax-typescript', { isTSX: true }],
          'styled-jsx/babel'
        ]
      })
      return { contents: result?.code ?? '', loader: 'tsx' }
    })
  }
}

const shared: Options = {
  entry,
  target: 'es2019',
  splitting: true,
  // Same file names in both folders, as the `exports` map in package.json expects
  outExtension: () => ({ js: '.js' }),
  sourcemap: false,
  // Only core/Next uses it, and it comes from the app, not from the package
  external: ['next'],
  tsconfig: 'scripts/tsconfig.json',
  esbuildPlugins: [styledJsx],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
}

export default defineConfig([
  { ...shared, format: 'esm', outDir: 'esm' },
  { ...shared, format: 'cjs', outDir: 'dist' }
])
