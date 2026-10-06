import { readFile, mkdir, writeFile } from 'fs/promises'
import { readdirSync, existsSync } from 'fs'
import { join, dirname, basename, resolve } from 'path'
import { defineConfig, type Options } from 'tsup'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'

// One entry for the package and one per folder, so `@bolio-ui/core/esm/Button`
// and `@bolio-ui/core/dist/Button` keep working
const entry: Record<string, string> = { index: 'core/index.ts' }
for (const name of readdirSync('core')) {
  const file = join('core', name, 'index.ts')
  if (existsSync(file)) entry[`${name}/index`] = file
}

// esbuild has no CSS Modules support of its own, and (unlike an app bundler)
// no way to hand a bundled `.css` file to a page - a prebuilt library's JS
// can't make a downstream bundler auto-load a sibling stylesheet just because
// it sits next to the `.js` (confirmed by egoist/tsup#1101: this is a known
// tsup/esbuild limitation, not something fixable from a single plugin). So
// `*.module.css` is scoped with postcss-modules (what Vite/webpack use under
// the hood too) into a class name map, which becomes the JS side of the
// import (`import styles from './Button.module.css'`); the scoped CSS text
// itself is written straight to disk as real, plain `.css` files (one
// combined `styles.css`, one per component under `css/`, each in its own
// `@layer` so consumers can override without fighting specificity or import
// order) that the consumer imports explicitly, the same way every other
// component library ships static CSS (e.g. Mantine's `styles.css`).
const SOURCE_SUFFIX = '.bolio-css-module-source'
const cssModules: NonNullable<Options['esbuildPlugins']>[number] = {
  name: 'css-modules',
  setup(build) {
    const perComponent = new Map<string, string>()

    build.onResolve({ filter: /\.module\.css$/ }, (args) => ({
      path: resolve(args.resolveDir, args.path) + SOURCE_SUFFIX,
      namespace: 'css-module-source'
    }))

    build.onLoad(
      { filter: /.*/, namespace: 'css-module-source' },
      async ({ path: virtualPath }) => {
        const path = virtualPath.slice(0, -SOURCE_SUFFIX.length)
        const source = await readFile(path, 'utf8')
        let tokens: Record<string, string> = {}
        const result = await postcss([
          postcssModules({
            getJSON: (_file, json) => {
              tokens = json
            },
            generateScopedName: '[name]_[local]__[hash:base64:5]',
            root: process.cwd()
          })
        ]).process(source, { from: path })
        const folderName = basename(dirname(path))
        const fileName = basename(path, '.module.css')
        const componentName =
          fileName === folderName ? folderName : `${folderName}-${fileName}`
        perComponent.set(
          componentName,
          `@layer ${componentName} {\n${result.css}\n}\n`
        )
        return { contents: `export default ${JSON.stringify(tokens)};`, loader: 'js' }
      }
    )

    build.onEnd(async () => {
      if (perComponent.size === 0) return
      const outDir = build.initialOptions.outdir as string
      await mkdir(join(outDir, 'css'), { recursive: true })
      const names = [...perComponent.keys()]
      const combined = `@layer ${names.join(', ')};\n\n${[...perComponent.values()].join('\n')}`
      await Promise.all([
        writeFile(join(outDir, 'styles.css'), combined),
        ...names.map((name) =>
          writeFile(join(outDir, 'css', `${name}.css`), perComponent.get(name)!)
        )
      ])
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
  tsconfig: 'scripts/tsconfig.json',
  esbuildPlugins: [cssModules],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
}

export default defineConfig([
  { ...shared, format: 'esm', outDir: 'esm' },
  { ...shared, format: 'cjs', outDir: 'dist' }
])
