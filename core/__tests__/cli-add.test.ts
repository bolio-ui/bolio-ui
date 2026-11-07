/**
 * @jest-environment node
 */
import { execFile } from 'child_process'
import { createServer } from 'http'
import type { Server } from 'http'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'

const run = promisify(execFile)
const cli = join(process.cwd(), 'cli', 'index.js')

const registry: Record<string, unknown> = {
  index: ['Button', 'Evil'],
  Button: {
    name: 'Button',
    dependencies: [],
    files: [
      { path: 'Button/index.ts', content: 'export {}\n' },
      { path: 'Button/example.tsx', content: 'export default null\n' },
      { path: 'utils/types.ts', content: 'export type A = 1\n' }
    ]
  },
  Evil: {
    name: 'Evil',
    dependencies: [],
    files: [{ path: '../evil.ts', content: 'export {}\n' }]
  }
}

let server: Server
let url: string
const roots: string[] = []

beforeAll(async () => {
  server = createServer((req, res) => {
    const item = registry[(req.url ?? '').replace(/^\/|\.json$/g, '')]
    res.statusCode = item ? 200 : 404
    res.end(JSON.stringify(item))
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  url = `http://127.0.0.1:${typeof address === 'object' && address?.port}`
})

afterAll(() => {
  server.close()
  roots.forEach((root) => rmSync(root, { recursive: true, force: true }))
})

const project = (...folders: string[]) => {
  const root = mkdtempSync(join(tmpdir(), 'bolio-add-'))
  roots.push(root)
  writeFileSync(join(root, 'package.json'), '{}')
  folders.forEach((folder) => mkdirSync(join(root, folder)))
  return root
}

const add = (cwd: string, ...args: string[]) =>
  run('node', [cli, 'add', ...args, '--registry', url], { cwd })

describe('bolio-ui add', () => {
  it('copies the component and what it needs into components/bolio-ui', async () => {
    const root = project()
    const { stdout } = await add(root, 'button')
    expect(existsSync(join(root, 'components/bolio-ui/Button/index.ts'))).toBe(
      true
    )
    expect(existsSync(join(root, 'components/bolio-ui/utils/types.ts'))).toBe(
      true
    )
    expect(stdout).toContain('Added button to components/bolio-ui')
    expect(stdout).toContain(join('components/bolio-ui', 'Button/example.tsx'))
  })

  it('writes to src/components/bolio-ui when the project has a src folder', async () => {
    const root = project('src')
    await add(root, 'Button')
    expect(
      existsSync(join(root, 'src/components/bolio-ui/Button/index.ts'))
    ).toBe(true)
  })

  it('writes to the folder given with --dir', async () => {
    const root = project('src')
    await add(root, 'button', '--dir', 'app/ui')
    expect(existsSync(join(root, 'app/ui/Button/index.ts'))).toBe(true)
    expect(existsSync(join(root, 'src/components'))).toBe(false)
  })

  it('keeps a changed file, and replaces it with --overwrite', async () => {
    const root = project()
    await add(root, 'button')
    const file = join(root, 'components/bolio-ui/Button/index.ts')
    writeFileSync(file, 'mine\n')

    const kept = await add(root, 'button')
    expect(readFileSync(file, 'utf8')).toBe('mine\n')
    expect(kept.stdout).toContain('Button/index.ts')

    await add(root, 'button', '--overwrite')
    expect(readFileSync(file, 'utf8')).toBe('export {}\n')
  })

  it('refuses a file that would land outside the folder', async () => {
    const root = project()
    await expect(add(root, 'evil')).rejects.toMatchObject({
      stderr: expect.stringContaining('outside of the folder')
    })
    expect(existsSync(join(root, 'components/evil.ts'))).toBe(false)
  })

  it('fails on an unknown component', async () => {
    await expect(add(project(), 'nope')).rejects.toMatchObject({
      stderr: expect.stringContaining('There is no component named "nope"')
    })
  })

  it('fails outside of a project', async () => {
    const root = project()
    rmSync(join(root, 'package.json'))
    await expect(add(root, 'button')).rejects.toMatchObject({
      stderr: expect.stringContaining('No package.json found')
    })
  })
})
