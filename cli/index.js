#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

// Redwood keeps the React app (and its dependencies) in the `web` folder
const root = process.cwd()
const cwd = fs.existsSync(path.join(root, 'redwood.toml'))
  ? path.join(root, 'web')
  : root
const args = process.argv.slice(2)
const docs = 'https://bolio-ui.com/guide/getting-started'

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const read = (file) => fs.readFileSync(path.join(cwd, file), 'utf8')
const withExt = (base) => ['tsx', 'jsx', 'js'].map((ext) => `${base}.${ext}`)
const find = (files) =>
  files.find((file) => fs.existsSync(path.join(cwd, file)))

const findUp = (name, dir = cwd) =>
  fs.existsSync(path.join(dir, name))
    ? true
    : path.dirname(dir) !== dir && findUp(name, path.dirname(dir))

if (args[0] !== 'init') fail('Usage: bolio-ui init [--icons]')
if (!find(['package.json']))
  fail(
    'No package.json found. Run this command at the root of your React project.'
  )

const pkg = JSON.parse(read('package.json'))
const deps = { ...pkg.dependencies, ...pkg.devDependencies }

const coreImport = "import { BolioUIProvider } from '@bolio-ui/core'"
const nextImport = "import { StyledJsxRegistry } from '@bolio-ui/core/next'"
const provider = ['<BolioUIProvider>', '</BolioUIProvider>']

const gatsbyBrowser = `import * as React from 'react'
${coreImport}

export const wrapRootElement = ({ element }) => (
  <BolioUIProvider>{element}</BolioUIProvider>
)
`

const getSetup = () => {
  if (deps.next) {
    const layout = find(
      ['src/app', 'app'].flatMap((base) => withExt(`${base}/layout`))
    )
    if (layout) {
      const hasRegistry = read(layout).includes('StyledJsxRegistry')
      return {
        file: layout,
        target: '{children}',
        wrapper: hasRegistry
          ? provider
          : [
              '<StyledJsxRegistry><BolioUIProvider>',
              '</BolioUIProvider></StyledJsxRegistry>'
            ],
        imports: hasRegistry ? [coreImport] : [coreImport, nextImport]
      }
    }
    const app = find(
      ['src/pages', 'pages'].flatMap((base) => withExt(`${base}/_app`))
    )
    if (app)
      return {
        file: app,
        target: '<Component {...pageProps} />',
        wrapper: provider,
        imports: [coreImport]
      }
    fail(
      `Could not find app/layout or pages/_app. Set up BolioUIProvider manually: ${docs}`
    )
  }
  if (deps['@redwoodjs/web']) {
    const app = find(withExt('src/App'))
    if (app)
      return {
        file: app,
        target: '<Routes />',
        wrapper: provider,
        imports: [coreImport]
      }
    fail(`Could not find src/App. Set up BolioUIProvider manually: ${docs}`)
  }
  if (deps['@remix-run/react'] || deps['@react-router/dev']) {
    const rootFile = find(withExt('app/root'))
    if (rootFile)
      return {
        file: rootFile,
        target: '<Outlet />',
        wrapper: provider,
        imports: [coreImport]
      }
    fail(`Could not find app/root. Set up BolioUIProvider manually: ${docs}`)
  }
  if (deps.gatsby) {
    // Gatsby has no root component, so the provider goes in wrapRootElement
    const ext = find(['tsconfig.json']) ? 'tsx' : 'js'
    return {
      files: {
        [`gatsby-browser.${ext}`]: gatsbyBrowser,
        [`gatsby-ssr.${ext}`]: `export { wrapRootElement } from './gatsby-browser'\n`
      }
    }
  }
  if (deps.vite) {
    const main = find(['src/main', 'src/index'].flatMap(withExt))
    if (main) {
      // React Router in library mode renders a RouterProvider instead of <App />
      const target =
        read(main).match(/<RouterProvider\b[^]*?\/>|<App\s*\/>/)?.[0] ||
        '<App />'
      return { file: main, target, wrapper: provider, imports: [coreImport] }
    }
    fail(`Could not find src/main. Set up BolioUIProvider manually: ${docs}`)
  }
  fail(
    `Could not detect Next.js, Remix, React Router, Gatsby, Redwood or Vite. Set up BolioUIProvider manually: ${docs}`
  )
}

const managers = [
  ['yarn.lock', 'yarn', 'add'],
  ['pnpm-lock.yaml', 'pnpm', 'add'],
  ['bun.lock', 'bun', 'add'],
  ['bun.lockb', 'bun', 'add']
]
const [, pm, command] = managers.find(([lock]) => findUp(lock)) || [
  null,
  'npm',
  'install'
]

const install = () => {
  const packages = [
    '@bolio-ui/core',
    ...(args.includes('--icons') ? ['@bolio-ui/icons'] : [])
  ].filter((name) => !deps[name])
  if (!packages.length) return
  console.log(`Installing ${packages.join(', ')} with ${pm}`)
  const { status } = spawnSync(pm, [command, ...packages], {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
  if (status !== 0)
    fail(
      `The install failed. Run \`${pm} ${command} ${packages.join(
        ' '
      )}\` and try again.`
    )
}

const update = ({ file, target, wrapper: [open, close], imports }) => {
  const source = read(file)
  if (source.includes('BolioUIProvider'))
    return console.log(`${file} already uses BolioUIProvider`)

  const matches = [
    ...source.matchAll(/^import\s(?:[^;'"]*?from\s*)?['"][^'"]+['"];?[ \t]*$/gm)
  ]
  const last = matches[matches.length - 1]
  const semi = last && last[0].endsWith(';') ? ';' : ''
  const lines = imports.map((line) => line + semi).join('\n')

  if (!source.includes(target)) {
    console.log(`Could not update ${file} automatically. Add this to it:\n`)
    console.log(`${lines}\n\n${open}${target}${close}\n`)
    return
  }
  const wrapped = source.replace(target, () => open + target + close)
  const end = last ? last.index + last[0].length : 0
  const output = last
    ? `${wrapped.slice(0, end)}\n${lines}${wrapped.slice(end)}`
    : `${lines}\n${wrapped}`
  fs.writeFileSync(path.join(cwd, file), output)
  console.log(`Updated ${file}`)
}

const create = (files) =>
  Object.entries(files).forEach(([file, content]) => {
    if (find(withExt(file.replace(/\.\w+$/, '')))) {
      console.log(`${file} already exists. Add this to it:\n\n${content}`)
      return
    }
    fs.writeFileSync(path.join(cwd, file), content)
    console.log(`Created ${file}`)
  })

const setup = getSetup()
install()
if (setup.files) create(setup.files)
else update(setup)
