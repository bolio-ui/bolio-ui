#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const docs = 'https://bolio-ui.com/docs/guide/getting-started'
const usage = `Usage: bolio-ui init [name] [options]
       bolio-ui add <component...> [--dir <folder>] [--overwrite]
       bolio-ui agents-md [file]

Sets up Bolio UI in the project of the current folder, or creates a new one.

add copies the source of a component, and of what it needs, into your project (src/components/bolio-ui by default, or components/bolio-ui without a src folder).

agents-md adds the Bolio UI docs for AI assistants to AGENTS.md, or to the file you give.

Options:
  -t, --template <name>  create a new project: next, vite, react-router, gatsby, redwood, tanstack, waku, rwsdk or astro
  --icons                also install @bolio-ui/icons
  -y, --yes              do not ask anything`

const argv = process.argv.slice(2)
const has = (...names) => names.some((name) => argv.includes(name))
const valueOf = (...names) => {
  const inline = argv.find((arg) => names.some((n) => arg.startsWith(`${n}=`)))
  if (inline) return inline.slice(inline.indexOf('=') + 1)
  const at = argv.findIndex((arg) => names.includes(arg))
  return at === -1 ? undefined : argv[at + 1]
}
const fail = (message) => {
  console.error(message)
  process.exit(1)
}

if (argv[0] === 'agents-md') {
  const file = path.resolve(argv[1] || 'AGENTS.md')
  const marker = '<!-- bolio-ui -->'
  const block = `${marker}
## Bolio UI

This project uses Bolio UI (\`@bolio-ui/core\`). Before writing UI code, read the docs for assistants:

- Index of every page: https://bolio-ui.com/llms.txt
- All docs in one file: https://bolio-ui.com/llms-full.txt
- One page as Markdown: https://bolio-ui.com/md/components/<name>
${marker}
`
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  const [before, , after = ''] = current.split(marker)
  const next = current.includes(marker)
    ? `${before}${block.trimEnd()}${after}`
    : `${current}${current ? (current.endsWith('\n') ? '\n' : '\n\n') : ''}${block}`
  fs.writeFileSync(file, next)
  console.log(`Bolio UI docs added to ${path.relative(process.cwd(), file)}`)
  process.exit(0)
}
// Copies the source of a component, and of what it imports, into the project.
// The files import each other by relative paths, so they keep working as long
// as they all go under the same folder.
const add = async () => {
  const registry = (valueOf('--registry') || 'https://bolio-ui.com/r').replace(
    /\/$/,
    ''
  )
  const wanted = argv.slice(1).filter((arg, i, rest) => {
    return (
      !arg.startsWith('-') && !['--dir', '--registry'].includes(rest[i - 1])
    )
  })
  if (!wanted.length) fail(usage)
  const cwd = process.cwd()
  if (!fs.existsSync(path.join(cwd, 'package.json')))
    fail('No package.json found. Run this command at the root of your project.')
  const dir = path.resolve(
    cwd,
    valueOf('--dir') ||
      (fs.existsSync(path.join(cwd, 'src')) ? 'src' : '.') +
        '/components/bolio-ui'
  )

  const get = async (name) => {
    const response = await fetch(`${registry}/${name}.json`).catch(() => null)
    if (!response?.ok)
      fail(
        `Could not load ${registry}/${name}.json. Check your connection and try again.`
      )
    return response.json()
  }
  const available = await get('index')
  const files = new Map()
  const examples = []
  for (const name of wanted) {
    const found = available.find(
      (item) => item.toLowerCase() === name.toLowerCase()
    )
    if (!found)
      fail(
        `There is no component named "${name}". The list is at ${registry}/index.json`
      )
    for (const file of (await get(found)).files)
      files.set(file.path, file.content)
    if (files.has(`${found}/example.tsx`)) examples.push(`${found}/example.tsx`)
  }

  const kept = []
  for (const [file, content] of files) {
    const target = path.join(dir, file)
    if (path.relative(dir, target).startsWith('..'))
      fail(`The registry sent a file outside of the folder: ${file}`)
    if (fs.existsSync(target) && !has('--overwrite')) {
      if (fs.readFileSync(target, 'utf8') !== content) kept.push(file)
      continue
    }
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, content)
  }

  const shown = path.relative(cwd, dir)
  console.log(`Added ${wanted.join(', ')} to ${shown}`)
  if (examples.length)
    console.log(
      `\nExamples to start from:\n${examples.map((file) => `  ${path.join(shown, file)}`).join('\n')}`
    )
  if (kept.length)
    console.log(
      `\nThese files already exist and differ, so they were kept. Run again with --overwrite to replace them:\n${kept.map((file) => `  ${file}`).join('\n')}`
    )
}

if (argv[0] !== 'init' && argv[0] !== 'add') fail(usage)
const yes = has('-y', '--yes')
const ask = yes || !process.stdin.isTTY || !process.stdout.isTTY ? null : true

// Each template is the command of its own project generator, run without
// questions.
const npx = (...args) => ['npx', ['--yes', ...args]]
const templates = {
  next: (name, pm) =>
    npx(
      'create-next-app@latest',
      name,
      '--yes',
      '--app',
      '--ts',
      '--no-tailwind',
      `--use-${pm}`
    ),
  vite: (name) =>
    npx(
      'create-vite@latest',
      name,
      '--template',
      'react-ts',
      '--no-interactive',
      '--no-immediate'
    ),
  'react-router': (name) =>
    npx('create-react-router@latest', name, '--yes', '--no-git-init'),
  gatsby: (name) => npx('create-gatsby@latest', name, '-y', '-ts'),
  redwood: (name) =>
    npx('create-redwood-app@latest', name, '--yes', '--ts', '--no-git-init'),
  tanstack: (name) =>
    npx('@tanstack/cli@latest', 'create', name, '--yes', '--no-git'),
  waku: (name) =>
    npx(
      'create-waku@latest',
      '--project-name',
      name,
      '--template',
      '01_basic',
      '--skip-install'
    ),
  rwsdk: (name) => npx('create-rwsdk@latest', 'create', name),
  astro: (name) =>
    npx('create-astro@latest', name, '--yes', '--add', 'react', '--no-git')
}

const readline = require('readline/promises')
const prompt = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const answer = (await rl.question(question)).trim()
  rl.close()
  return answer
}

const withExt = (base) => ['tsx', 'jsx', 'js'].map((ext) => `${base}.${ext}`)
const findUp = (name, dir) =>
  fs.existsSync(path.join(dir, name))
    ? true
    : path.dirname(dir) !== dir && findUp(name, path.dirname(dir))

const packageManager = (dir) => {
  const managers = [
    ['yarn.lock', 'yarn', 'add'],
    ['pnpm-lock.yaml', 'pnpm', 'add'],
    ['bun.lock', 'bun', 'add'],
    ['bun.lockb', 'bun', 'add']
  ]
  const [, pm, command] = managers.find(([lock]) => findUp(lock, dir)) || [
    null,
    'npm',
    'install'
  ]
  return { pm, command }
}

// A project with a `packageManager` field (Redwood has one) is meant to run
// its manager through Corepack, which is in Node, even when it is not enabled
const corepackManager = (dir) => {
  const file = path.join(dir, 'package.json')
  const field = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8')).packageManager
    : null
  if (field) return field
  return path.dirname(dir) !== dir ? corepackManager(path.dirname(dir)) : null
}

// npm warnings, audit and funding notices come from the generators and their
// templates, not from this setup. Their stderr is kept and shown only when the
// command fails; `hideOutput` also keeps stdout (package manager progress)
const quiet = {
  ...process.env,
  npm_config_loglevel: 'error',
  npm_config_audit: 'false',
  npm_config_fund: 'false'
}

// `keepStderr` leaves stderr connected to the terminal, for generators that
// draw their spinner there (Gatsby crashes when it is a pipe)
const run = (command, args, cwd, hideOutput = false, keepStderr = false) => {
  const result = spawnSync(command, args, {
    cwd,
    env: quiet,
    stdio: [
      'inherit',
      hideOutput ? 'pipe' : 'inherit',
      keepStderr ? 'inherit' : 'pipe'
    ],
    shell: process.platform === 'win32'
  })
  const ok = result.status === 0
  if (!ok) {
    process.stdout.write(result.stdout || '')
    process.stderr.write(result.stderr || '')
  }
  return ok
}

const main = async () => {
  let root = process.cwd()
  let template = valueOf('-t', '--template')
  const nameArg = argv.slice(1).find((arg, i, rest) => {
    const before = rest[i - 1]
    return !arg.startsWith('-') && !['-t', '--template'].includes(before)
  })
  let created = false

  // No project in this folder and no template: offer to create one
  if (!template && !fs.existsSync(path.join(root, 'package.json'))) {
    if (!ask)
      fail(
        'No package.json found. Run this command at the root of your React project, or create a project with --template.\n\n' +
          usage
      )
    console.log('No project found in this folder. Create a new one?\n')
    const names = Object.keys(templates)
    names.forEach((name, i) => console.log(`  ${i + 1}. ${name}`))
    const answer = await prompt('\nTemplate (number, or Enter to cancel): ')
    template = names[Number(answer) - 1]
    if (!template) fail('Nothing created.')
  }

  if (template) {
    if (!templates[template])
      fail(
        `Unknown template "${template}". Use one of: ${Object.keys(templates).join(', ')}.`
      )
    const node = process.versions.node
    if (template === 'astro' && Number(node.split('.')[0]) < 22)
      fail(
        `Astro needs Node 22 or newer, and you are on Node ${node}. Switch with \`nvm use 22\` and run this command again.`
      )
    if (template === 'redwood' && node.split('.')[0] !== '20')
      fail(
        `Redwood needs Node 20, and you are on Node ${node}. Switch with \`nvm use 20\` and run this command again.`
      )
    let name = nameArg
    if (!name)
      name = ask
        ? (await prompt('Project name (my-app): ')) || 'my-app'
        : 'my-app'
    const target = path.resolve(name)
    if (fs.existsSync(target) && fs.readdirSync(target).length)
      fail(`${path.relative(root, target) || target} is not empty.`)
    const agent = process.env.npm_config_user_agent || ''
    const pm = ['pnpm', 'yarn', 'bun'].find((n) => agent.startsWith(n)) || 'npm'
    const [command, args] = templates[template](name, pm)
    console.log(`Creating a ${template} project\n`)
    if (!run(command, args, root, false, template === 'gatsby'))
      fail(
        `The ${template} generator failed. Fix the error above and try again.`
      )
    // some generators print a problem and still exit with 0
    if (!fs.existsSync(path.join(target, 'package.json')))
      fail(`The ${template} generator did not create ${name}. See above.`)
    root = target
    created = true
  }

  // Redwood keeps the React app (and its dependencies) in the `web` folder
  const cwd = fs.existsSync(path.join(root, 'redwood.toml'))
    ? path.join(root, 'web')
    : root
  const read = (file) => fs.readFileSync(path.join(cwd, file), 'utf8')
  const find = (files) =>
    files.find((file) => fs.existsSync(path.join(cwd, file)))

  if (!find(['package.json']))
    fail(
      'No package.json found. Run this command at the root of your React project.'
    )
  const pkg = JSON.parse(read('package.json'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }

  const coreImport = `import '@bolio-ui/core/styles.css'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'`

  // Gatsby compiles JSX with the classic runtime, so React has to be imported
  const gatsbyBrowser = (ts) => `import * as React from 'react'
${ts ? "import type { GatsbyBrowser } from 'gatsby'\n" : ''}${coreImport}

export const wrapRootElement${ts ? ": GatsbyBrowser['wrapRootElement']" : ''} = ({ element }) => (
  <BolioUIProvider>
    <CssBaseline />
    {element}
  </BolioUIProvider>
)
`

  const nextApp = (ts) => `${
    ts ? "import type { AppProps } from 'next/app'\n" : ''
  }${coreImport}

export default function App({ Component, pageProps }${ts ? ': AppProps' : ''}) {
  return (
    <BolioUIProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </BolioUIProvider>
  )
}
`

  // Astro renders React only in islands, so the provider is a component to
  // wrap the content of each island
  const astroProvider = (ts) => `${coreImport}
${ts ? "import type { ReactNode } from 'react'\n" : ''}
export default function BolioUI({ children }${ts ? ': { children: ReactNode }' : ''}) {
  return (
    <BolioUIProvider>
      <CssBaseline />
      {children}
    </BolioUIProvider>
  )
}
`

  // `target` is the element that gets wrapped in the provider. With `link`, the
  // file is a server component that cannot import CSS, so the stylesheet is a
  // URL linked in its <head> (RedwoodSDK)
  const edit = (file, target, link) => ({ file, target, link })

  const getSetup = () => {
    if (deps.next) {
      const layout = find(
        ['src/app', 'app'].flatMap((base) => withExt(`${base}/layout`))
      )
      if (layout) return edit(layout, '{children}')
      const app = find(
        ['src/pages', 'pages'].flatMap((base) => withExt(`${base}/_app`))
      )
      if (app) return edit(app, '<Component {...pageProps} />')
      const pages = find(['src/pages', 'pages'])
      if (pages) {
        const ts = find(['tsconfig.json'])
        return {
          files: { [`${pages}/_app.${ts ? 'tsx' : 'js'}`]: nextApp(ts) }
        }
      }
      fail(
        `Could not find app/layout or pages. Set up BolioUIProvider manually: ${docs}`
      )
    }
    if (deps['@redwoodjs/web']) {
      const app = find(withExt('src/App'))
      // older apps render the routes here, newer ones receive them as children
      if (app)
        return edit(
          app,
          read(app).includes('<Routes />') ? '<Routes />' : '{children}'
        )
      fail(`Could not find src/App. Set up BolioUIProvider manually: ${docs}`)
    }
    if (deps['@remix-run/react'] || deps['@react-router/dev']) {
      const rootFile = find(withExt('app/root'))
      if (rootFile) return edit(rootFile, '<Outlet />')
      fail(`Could not find app/root. Set up BolioUIProvider manually: ${docs}`)
    }
    if (deps.gatsby) {
      // Gatsby has no root component, so the provider goes in wrapRootElement
      const ts = find(['tsconfig.json'])
      const ext = ts ? 'tsx' : 'js'
      return {
        files: {
          [`gatsby-browser.${ext}`]: gatsbyBrowser(ts),
          [`gatsby-ssr.${ext}`]: `export { wrapRootElement } from './gatsby-browser'\n`
        }
      }
    }
    if (deps['@tanstack/react-start']) {
      const rootFile = find(withExt('src/routes/__root'))
      if (rootFile) return edit(rootFile, '{children}')
      fail(
        `Could not find src/routes/__root. Set up BolioUIProvider manually: ${docs}`
      )
    }
    if (deps.waku) {
      const layout = find(withExt('src/pages/_layout'))
      if (layout) return edit(layout, '{children}')
      fail(
        `Could not find src/pages/_layout. Set up BolioUIProvider manually: ${docs}`
      )
    }
    if (deps.rwsdk) {
      const document = find(withExt('src/app/document'))
      if (document) return edit(document, '{children}', true)
      fail(
        `Could not find src/app/document. Set up BolioUIProvider manually: ${docs}`
      )
    }
    if (deps.astro) {
      const ts = find(['tsconfig.json'])
      return {
        files: {
          [`src/components/BolioUI.${ts ? 'tsx' : 'jsx'}`]: astroProvider(ts)
        },
        hint: 'Astro renders React only in islands. Wrap the content of each island with BolioUI, for example <BolioUI client:load><YourComponent /></BolioUI> in an .astro file.'
      }
    }
    if (deps.vite && deps.react) {
      const main = find(['src/main', 'src/index'].flatMap(withExt))
      if (main) {
        // React Router in library mode renders a RouterProvider instead of <App />
        const target =
          read(main).match(/<RouterProvider\b[^]*?\/>|<App\s*\/>/)?.[0] ||
          '<App />'
        return edit(main, target)
      }
      fail(`Could not find src/main. Set up BolioUIProvider manually: ${docs}`)
    }
    fail(
      `Could not detect Next.js, Remix, React Router, Gatsby, Redwood, TanStack Start, Waku, RedwoodSDK, Astro or Vite with React. Set up BolioUIProvider manually: ${docs}`
    )
  }

  const setup = getSetup()

  let icons = has('--icons')
  if (!icons && ask && !deps['@bolio-ui/icons'])
    icons = /^y/i.test(await prompt('Install @bolio-ui/icons too? (y/N) '))

  const { pm, command } = packageManager(cwd)
  const packages = [
    '@bolio-ui/core',
    ...(icons ? ['@bolio-ui/icons'] : []),
    // Waku builds with a Babel plugin whose peer dependency Yarn does not install
    ...(deps['@rolldown/plugin-babel'] ? ['@babel/core'] : [])
  ].filter((name) => !deps[name])
  if (packages.length) {
    console.log(`\nInstalling ${packages.join(', ')} with ${pm}`)
    const viaCorepack = corepackManager(cwd)?.split('@')[0] === pm
    const [bin, args] = viaCorepack
      ? ['corepack', [pm, command, ...packages]]
      : [pm, [command, ...packages]]
    if (!run(bin, args, cwd, true))
      fail(
        `The install failed. ${viaCorepack ? 'If Corepack is off, run `corepack enable`. ' : ''}Run \`${pm} ${command} ${packages.join(' ')}\` and try again.`
      )
  }

  const update = ({ file, target, link }) => {
    const source = read(file)
    if (source.includes('BolioUIProvider')) {
      console.log(`${file} already uses BolioUIProvider`)
      return true
    }

    const matches = [
      ...source.matchAll(
        /^import\s(?:[^;'"]*?from\s*)?['"][^'"]+['"];?[ \t]*$/gm
      )
    ]
    const last = matches[matches.length - 1]
    const semi = last && last[0].endsWith(';') ? ';' : ''
    const lines = (
      link
        ? `import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'\nimport bolioStyles from '@bolio-ui/core/styles.css?url'`
        : coreImport
    )
      .split('\n')
      .map((line) => line + semi)
      .join('\n')
    const stylesheet = '<link rel="stylesheet" href={bolioStyles} />'

    // the last one: a layout may also write `{children}` in its parameters
    const at = source.lastIndexOf(target)
    const inParameters =
      target === '{children}' && /[(,]\s*$/.test(source.slice(0, at))
    const head = source.match(/^([ \t]*)<head>[ \t]*\n/m)
    if (at === -1 || inParameters || (link && !head)) {
      console.log(`Could not update ${file} automatically. Add this to it:\n`)
      console.log(
        `${lines}\n\n${link ? `${stylesheet} inside <head>, and ` : ''}<BolioUIProvider><CssBaseline />${target}</BolioUIProvider>\n`
      )
      return false
    }

    // alone on its line, the element is wrapped over several lines
    const lineStart = source.lastIndexOf('\n', at - 1) + 1
    const lineEnd = source.indexOf('\n', at)
    const indent = source.slice(lineStart, at)
    const rest = source.slice(
      at + target.length,
      lineEnd === -1 ? undefined : lineEnd
    )
    const alone = /^\s*$/.test(indent) && /^\s*$/.test(rest)
    const wrapped = alone
      ? `<BolioUIProvider>\n${indent}  <CssBaseline />\n${indent}  ${target}\n${indent}</BolioUIProvider>`
      : `<BolioUIProvider><CssBaseline />${target}</BolioUIProvider>`
    const wrappedSource = alone
      ? source.slice(0, lineStart) +
        indent +
        wrapped +
        source.slice(at + target.length)
      : source.slice(0, at) + wrapped + source.slice(at + target.length)
    // <head> comes before the children, so the offsets after it do not move
    const body = link
      ? wrappedSource.replace(
          /^([ \t]*)<head>[ \t]*\n/m,
          (match, space) => `${match}${space}  ${stylesheet}\n`
        )
      : wrappedSource

    const end = last ? last.index + last[0].length : 0
    // a file with no imports gets a blank line between them and the code
    const output = last
      ? `${body.slice(0, end)}\n${lines}${body.slice(end)}`
      : `${lines}\n\n${body}`
    fs.writeFileSync(path.join(cwd, file), output)
    console.log(`Updated ${file}`)
    return true
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

  const done = setup.files ? (create(setup.files), true) : update(setup)
  if (setup.hint) console.log(`\n${setup.hint}`)

  const dev = deps['@redwoodjs/web']
    ? 'yarn rw dev'
    : `${pm} ${pm === 'npm' ? 'run ' : ''}${deps.gatsby ? 'develop' : 'dev'}`
  if (!done) return console.log(`\nAdd the lines above, then see ${docs}`)
  // `yarn --version` passes with the wrong Yarn, so compare the versions
  const [manager, wanted] = (corepackManager(cwd) || '').split('@')
  // a manager that cannot run (missing, or a .cmd on Windows) has no output
  const current = manager
    ? spawnSync(manager, ['--version'], {
        cwd,
        encoding: 'utf8',
        shell: process.platform === 'win32'
      }).stdout || ''
    : ''
  if (wanted && current.trim().split('.')[0] !== wanted.split('.')[0])
    console.log(
      `\nYour current ${manager} is ${current.trim() || 'missing'} and this project uses ${wanted}. Run \`corepack enable\` once, then \`${dev}\`.`
    )
  console.log(
    `\nDone.${created ? ` Run \`cd ${path.relative(process.cwd(), root)}\` and then \`${dev}\`.` : ''} See ${docs}`
  )
}

if (argv[0] === 'add') add()
else main()
