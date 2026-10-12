import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'

// `bolio-ui init` on small projects. Every project already lists
// @bolio-ui/core, so the command only edits files and installs nothing.
const cli = path.join(__dirname, '../../cli/index.js')

const project = (
  dependencies: Record<string, string>,
  files: Record<string, string>
) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bolio-cli-'))
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({ dependencies: { '@bolio-ui/core': '3', ...dependencies } })
  )
  Object.entries(files).forEach(([file, content]) => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    fs.writeFileSync(path.join(dir, file), content)
  })
  return dir
}
const init = (dir: string, ...args: Array<string>) =>
  spawnSync('node', [cli, 'init', '-y', ...args], {
    cwd: dir,
    encoding: 'utf8'
  })
const read = (dir: string, file: string) =>
  fs.readFileSync(path.join(dir, file), 'utf8')

const layout = `export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
`

describe('bolio-ui init', () => {
  it('wraps the children of a Next.js app layout over several lines', () => {
    const dir = project({ next: '16' }, { 'app/layout.js': layout })
    expect(init(dir).status).toBe(0)
    const output = read(dir, 'app/layout.js')
    expect(output).toContain("import '@bolio-ui/core/styles.css'")
    expect(output).toContain(
      '        <BolioUIProvider>\n          <CssBaseline />\n          {children}\n        </BolioUIProvider>'
    )
  })

  it('does not touch a layout that only has {children} in its parameters', () => {
    const source = `export default function L({children}) { return <body>{props.children}</body> }\n`
    const dir = project({ next: '16' }, { 'app/layout.js': source })
    const result = init(dir)
    expect(read(dir, 'app/layout.js')).toBe(source)
    expect(result.stdout).toContain('Could not update app/layout.js')
    expect(result.stdout).toContain('Add the lines above')
  })

  it('wraps the children, not the parameter, in a compact layout', () => {
    const dir = project(
      { next: '16' },
      { 'app/layout.js': layout.replace('{ children }', '{children}') }
    )
    init(dir)
    expect(read(dir, 'app/layout.js')).toContain(
      'export default function RootLayout({children}) {'
    )
    expect(read(dir, 'app/layout.js')).toContain('<CssBaseline />\n')
  })

  it('does nothing the second time', () => {
    const dir = project({ next: '16' }, { 'app/layout.js': layout })
    init(dir)
    const once = read(dir, 'app/layout.js')
    expect(init(dir).stdout).toContain('already uses BolioUIProvider')
    expect(read(dir, 'app/layout.js')).toBe(once)
  })

  it('wraps <App /> in a Vite entry', () => {
    const dir = project(
      { vite: '8', react: '19' },
      {
        'src/main.tsx': `import App from './App'\n\nrender(\n  <StrictMode>\n    <App />\n  </StrictMode>\n)\n`
      }
    )
    init(dir)
    expect(read(dir, 'src/main.tsx')).toContain(
      '    <BolioUIProvider>\n      <CssBaseline />\n      <App />\n    </BolioUIProvider>'
    )
  })

  it('creates the Gatsby files, typed when there is a tsconfig', () => {
    const dir = project({ gatsby: '5' }, { 'tsconfig.json': '{}' })
    init(dir)
    const browser = read(dir, 'gatsby-browser.tsx')
    expect(browser).toContain("import * as React from 'react'")
    expect(browser).toContain("GatsbyBrowser['wrapRootElement']")
    expect(read(dir, 'gatsby-ssr.tsx')).toContain('./gatsby-browser')
  })

  it('creates pages/_app when a Next.js pages project has none', () => {
    const dir = project(
      { next: '14' },
      { 'tsconfig.json': '{}', 'pages/index.tsx': 'export default () => null' }
    )
    init(dir)
    expect(read(dir, 'pages/_app.tsx')).toContain('<BolioUIProvider>')
  })

  it('fails with the usage for another command, and with a message for a project it does not know', () => {
    const dir = project({ express: '4' }, {})
    expect(
      spawnSync('node', [cli, 'start'], { cwd: dir, encoding: 'utf8' }).stderr
    ).toContain('Usage: bolio-ui init')
    const result = init(dir)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain(
      'https://bolio-ui.com/docs/guide/getting-started'
    )
  })

  it('refuses an unknown template and a folder that is not empty', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bolio-cli-'))
    expect(init(dir, 'app', '-t', 'angular').stderr).toContain(
      'Unknown template "angular"'
    )
    fs.mkdirSync(path.join(dir, 'app'))
    fs.writeFileSync(path.join(dir, 'app/file'), '')
    expect(init(dir, 'app', '-t', 'next').stderr).toContain('is not empty')
  })
})

describe('bolio-ui agents-md', () => {
  const agentsMd = (dir: string, ...args: Array<string>) =>
    spawnSync('node', [cli, 'agents-md', ...args], {
      cwd: dir,
      encoding: 'utf8'
    })
  const empty = () => fs.mkdtempSync(path.join(os.tmpdir(), 'bolio-cli-'))

  it('creates AGENTS.md with the llms.txt links', () => {
    const dir = empty()
    expect(agentsMd(dir).status).toBe(0)
    expect(read(dir, 'AGENTS.md')).toContain('https://bolio-ui.com/llms.txt')
  })

  it('keeps what the file already has and adds the section once', () => {
    const dir = empty()
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Mine\n')
    agentsMd(dir)
    const first = read(dir, 'AGENTS.md')
    agentsMd(dir)
    expect(first.startsWith('# Mine\n')).toBe(true)
    expect(read(dir, 'AGENTS.md')).toBe(first)
    expect(first.split('<!-- bolio-ui -->')).toHaveLength(3)
  })

  it('updates an old section and leaves the text around it', () => {
    const dir = empty()
    fs.writeFileSync(
      path.join(dir, 'AGENTS.md'),
      '# Mine\n\n<!-- bolio-ui -->\nold\n<!-- bolio-ui -->\n\n# After\n'
    )
    agentsMd(dir)
    const output = read(dir, 'AGENTS.md')
    expect(output).not.toContain('old')
    expect(output).toContain('llms-full.txt')
    expect(output.startsWith('# Mine\n')).toBe(true)
    expect(output.endsWith('\n\n# After\n')).toBe(true)
  })

  it('writes to the file it is given', () => {
    const dir = empty()
    agentsMd(dir, 'CLAUDE.md')
    expect(read(dir, 'CLAUDE.md')).toContain('Bolio UI')
    expect(fs.existsSync(path.join(dir, 'AGENTS.md'))).toBe(false)
  })
})
