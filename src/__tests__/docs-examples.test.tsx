import fs from 'fs'
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { render } from '@testing-library/react'
import * as babel from '@babel/core'
import { BolioUIProvider } from 'core'
import transformLiveCode from 'src/components/Playground/transform-code'

// Every Playground of the component, hook and guide pages is run the way the site runs it:
// the `code` of the example is compiled and given the names of its `scope`,
// which the page imports. It must render on the server and in the browser
// without a React warning, so a missing scope name, a wrong prop or a broken
// example fails here instead of on the site.

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: () => undefined }),
  usePathname: () => '/'
}))

const docs = path.join(__dirname, '../content/docs')
const dirs = ['components', 'hooks', 'guide']

type Binding = { spec: string; imported: string }

// `import X, { a, b as c } from 'mod'` and `import * as X from 'mod'`
const parseImports = (text: string) => {
  const bindings = new Map<string, Binding>()
  for (const match of text.matchAll(
    /^import\s+([\s\S]*?)\s+from\s+'([^']+)'/gm
  )) {
    const [, clause, spec] = match
    const named = clause.match(/\{([\s\S]*?)\}/)?.[1]
    named?.split(',').forEach((item) => {
      const [imported, local] = item.trim().split(/\s+as\s+/)
      if (imported) bindings.set(local || imported, { spec, imported })
    })
    const rest = clause
      .replace(/\{[\s\S]*?\}/, '')
      .replace(/,/g, ' ')
      .trim()
    if (rest.startsWith('* as '))
      bindings.set(rest.slice(5).trim(), { spec, imported: '*' })
    else if (rest) bindings.set(rest, { spec, imported: 'default' })
  }
  return bindings
}

const parseExamples = (text: string) =>
  [...text.matchAll(/<Playground([\s\S]*?)\n\/>/g)].map((match) => {
    const body = match[1]
    const title = body.match(/title="([^"]+)"/)?.[1] || 'General'
    const scope = (body.match(/scope=\{\{([\s\S]*?)\}\}/)?.[1] || '')
      .split(',')
      .map((name) => name.trim().split(':')[0].trim())
      .filter(Boolean)
    // the code is a template literal in the page, so escapes mean the same
    const raw = body.match(/code=\{`([\s\S]*?)`\}/)?.[1] || ''
    const code = new Function(`return \`${raw}\``)() as string
    return { title, scope, code }
  })

const load = async (binding: Binding) => {
  const mod = await import(binding.spec)
  if (binding.imported === '*') return mod
  if (binding.imported === 'default') return mod.default ?? mod
  return mod[binding.imported]
}

const files = dirs.flatMap((dir) =>
  fs
    .readdirSync(path.join(docs, dir))
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => `${dir}/${file}`)
)

describe('docs examples', () => {
  files.forEach((file) => {
    const text = fs.readFileSync(path.join(docs, file), 'utf8')
    const imports = parseImports(text)

    parseExamples(text).forEach(({ title, scope, code }, index) => {
      it(`${file} #${index + 1} ${title}`, async () => {
        const values: Array<unknown> = []
        for (const name of scope) {
          const binding = imports.get(name)
          // a scope name the page does not import would be undefined on the site
          expect({ name, imported: Boolean(binding) }).toEqual({
            name,
            imported: true
          })
          values.push(await load(binding as Binding))
        }

        const compiled = babel.transformSync(transformLiveCode(code), {
          presets: ['@babel/preset-react'],
          babelrc: false,
          configFile: false
        })?.code as string
        let result: unknown
        new Function(...scope, 'render', 'React', compiled)(
          ...values,
          (value: unknown) => (result = value),
          React
        )
        const element =
          typeof result === 'function'
            ? React.createElement(result as React.FC)
            : (result as React.ReactElement)
        const tree = <BolioUIProvider>{element}</BolioUIProvider>

        renderToString(tree)
        const errors = jest
          .spyOn(console, 'error')
          .mockImplementation(() => undefined)
        render(tree)
        const messages = errors.mock.calls.map((call) =>
          String(call[0]).slice(0, 200)
        )
        errors.mockRestore()
        expect(messages).toEqual([])
      })
    })
  })
})
