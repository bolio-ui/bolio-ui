#!/usr/bin/env node
// MCP server (stdio) that gives AI assistants the Bolio UI docs. It speaks
// JSON-RPC, one message per line, and reads the pages that bolio-ui.com
// already publishes as Markdown (llms.txt and /md), so it needs no dependency.
const readline = require('readline')

const site = (process.env.BOLIO_UI_URL || 'https://bolio-ui.com').replace(
  /\/$/,
  ''
)

const get = async (route) => {
  const response = await fetch(`${site}${route}`)
  if (!response.ok)
    throw new Error(
      `${site}${route} answered ${response.status}. Check the name and try again.`
    )
  return response.text()
}

// "Button", "button" and "button-group" are the same kind of name
const slugOf = (name) =>
  String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')

// One section ("Components", "Hooks") of the llms.txt index
const listSection = async (name) => {
  const index = await get('/llms.txt')
  const section = index.split('## ').find((s) => s.startsWith(name))
  return section.split('\n').slice(2).join('\n').trim()
}

const tools = [
  {
    name: 'list_components',
    description: 'List every Bolio UI component with its name and summary.',
    inputSchema: { type: 'object', properties: {} },
    run: () => listSection('Components')
  },
  {
    name: 'list_hooks',
    description: 'List every Bolio UI hook with its name and summary.',
    inputSchema: { type: 'object', properties: {} },
    run: () => listSection('Hooks')
  },
  {
    name: 'get_component_docs',
    description:
      'Get the documentation of one or more components: props, examples and usage.',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'Component names, for example ["Button", "Modal"]'
        }
      },
      required: ['components']
    },
    run: async ({ components }) =>
      (
        await Promise.all(
          components.map((name) => get(`/md/components/${slugOf(name)}`))
        )
      ).join('\n\n---\n\n')
  },
  {
    name: 'get_theme_variables',
    description:
      'Get the theme tokens (palette, font, layout, breakpoints and expressiveness) of the light theme, the dark theme or both.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['light', 'dark'] }
      }
    },
    run: async ({ type }) => {
      const themes = JSON.parse(await get('/theme.json'))
      if (type && !themes[type])
        throw new Error(`Unknown theme "${type}". Use "light" or "dark".`)
      return JSON.stringify(type ? themes[type] : themes, null, 2)
    }
  },
  {
    name: 'get_docs',
    description:
      'Get one docs page by path, such as "guide/getting-started", "hooks/use-theme" or "components/button". Without a path, returns the index of every page.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'section/page' }
      }
    },
    run: async ({ path }) =>
      get(path ? `/md/${path.replace(/^\/|\.mdx?$/g, '')}` : '/llms.txt')
  }
]

const reply = (id, result) =>
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`)
const fail = (id, code, message) =>
  process.stdout.write(
    `${JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } })}\n`
  )

const handle = async ({ id, method, params = {} }) => {
  // notifications have no id and get no answer
  if (id === undefined) return
  if (method === 'initialize')
    return reply(id, {
      protocolVersion: params.protocolVersion || '2025-03-26',
      capabilities: { tools: {} },
      serverInfo: {
        name: 'bolio-ui',
        version: require('./package.json').version
      }
    })
  if (method === 'ping') return reply(id, {})
  if (method === 'tools/list')
    return reply(id, {
      tools: tools.map(({ run, ...tool }) => tool)
    })
  if (method === 'tools/call') {
    const tool = tools.find((t) => t.name === params.name)
    if (!tool) return fail(id, -32602, `Unknown tool ${params.name}`)
    try {
      const text = await tool.run(params.arguments || {})
      return reply(id, { content: [{ type: 'text', text }] })
    } catch (error) {
      return reply(id, {
        isError: true,
        content: [{ type: 'text', text: error.message }]
      })
    }
  }
  fail(id, -32601, `Method not found: ${method}`)
}

readline.createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return
  try {
    handle(JSON.parse(line))
  } catch {
    fail(null, -32700, 'Parse error')
  }
})
