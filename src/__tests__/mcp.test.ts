/** @jest-environment node */
import http from 'http'
import path from 'path'
import { spawn } from 'child_process'
import type { AddressInfo } from 'net'

// The @bolio-ui/mcp server over stdio, reading the docs from a fake site
const server = path.join(__dirname, '../../mcp/index.js')

const pages: Record<string, string> = {
  '/llms.txt':
    '# Bolio UI\n\n## Guide\n\n- [Start](x)\n\n## Components\n\n- [Button](https://bolio-ui.com/md/components/button): A button.\n- [Button Group](https://bolio-ui.com/md/components/button-group): Many.\n\n## Hooks\n\n- [useTheme](y)\n',
  '/md/components/button': 'BUTTON DOCS',
  '/md/components/button-group': 'GROUP DOCS',
  '/md/hooks/use-theme': 'THEME DOCS'
}

let site: http.Server
let url: string

beforeAll(async () => {
  site = http.createServer((request, response) => {
    const body = pages[request.url ?? '']
    response.statusCode = body ? 200 : 404
    response.end(body ?? 'not found')
  })
  await new Promise<void>((resolve) => site.listen(0, resolve))
  url = `http://localhost:${(site.address() as AddressInfo).port}`
})
afterAll(() => site.close())

type Message = {
  id: number
  result: {
    protocolVersion: string
    serverInfo: { name: string }
    tools: Array<{ name: string }>
    isError: boolean
    content: Array<{ text: string }>
  }
  error: { code: number }
}

// Sends the requests and returns the answers by id. Notifications get none.
const ask = (...requests: Array<object>): Promise<Record<number, Message>> =>
  new Promise((resolve, reject) => {
    const child = spawn('node', [server], {
      env: { ...process.env, BOLIO_UI_URL: url }
    })
    const answers: Record<number, Message> = {}
    const wanted = requests.filter((r) => 'id' in r).length
    let buffer = ''
    child.stdout.on('data', (chunk) => {
      buffer += chunk
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      lines.forEach((line) => {
        const message: Message = JSON.parse(line)
        answers[message.id] = message
      })
      if (Object.keys(answers).length === wanted) {
        child.kill()
        resolve(answers)
      }
    })
    child.on('error', reject)
    requests.forEach((request) =>
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...request })}\n`)
    )
  })

const call = (name: string, args?: object) => ({
  id: 1,
  method: 'tools/call',
  params: { name, arguments: args }
})
const text = (answers: Record<number, Message>) =>
  answers[1].result.content[0].text

describe('@bolio-ui/mcp', () => {
  it('answers the handshake and lists the three tools', async () => {
    const answers = await ask(
      {
        id: 1,
        method: 'initialize',
        params: { protocolVersion: '2025-06-18' }
      },
      { method: 'notifications/initialized' },
      { id: 2, method: 'tools/list' }
    )
    expect(answers[1].result.protocolVersion).toBe('2025-06-18')
    expect(answers[1].result.serverInfo.name).toBe('bolio-ui')
    expect(answers[2].result.tools.map((t) => t.name)).toEqual([
      'list_components',
      'get_component_docs',
      'get_docs'
    ])
  })

  it('list_components returns the components only', async () => {
    const output = text(await ask(call('list_components')))
    expect(output).toContain('[Button](')
    expect(output).toContain('[Button Group](')
    expect(output).not.toContain('Start')
    expect(output).not.toContain('useTheme')
  })

  it('get_component_docs reads each name as a page, in any case', async () => {
    const output = text(
      await ask(
        call('get_component_docs', { components: ['Button', 'Button Group'] })
      )
    )
    expect(output).toContain('BUTTON DOCS')
    expect(output).toContain('GROUP DOCS')
  })

  it('get_docs reads a page by path, or the index without one', async () => {
    expect(text(await ask(call('get_docs', { path: 'hooks/use-theme' })))).toBe(
      'THEME DOCS'
    )
    expect(text(await ask(call('get_docs')))).toContain('# Bolio UI')
  })

  it('tells what to do when a page does not exist', async () => {
    const answers = await ask(
      call('get_component_docs', { components: ['nope'] })
    )
    expect(answers[1].result.isError).toBe(true)
    expect(text(answers)).toContain('answered 404')
    expect(text(answers)).toContain('Check the name')
  })

  it('refuses an unknown tool and an unknown method', async () => {
    const tool = await ask(call('delete_everything'))
    expect(tool[1].error.code).toBe(-32602)
    const method = await ask({ id: 1, method: 'nope' })
    expect(method[1].error.code).toBe(-32601)
  })
})
