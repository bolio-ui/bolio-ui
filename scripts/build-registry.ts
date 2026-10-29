import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync
} from 'fs'
import { join, dirname, relative, extname } from 'path'

// Builds the registry the CLI `add` command reads: one JSON per component in
// public/r, holding every file the component needs (its folder plus the
// relative imports it pulls from other folders) and the npm packages it uses.
// The example.tsx of the component's own folder goes with it; stories and
// tests do not.

const root = 'core'
const out = join('public', 'r')
const extensions = ['', '.ts', '.tsx', '/index.ts', '/index.tsx']
const ignored = /(^|\/)(stories\.tsx|__tests__\/.*|.*\.d\.ts)$/
const provided = new Set(['react', 'react-dom'])

const resolveFile = (from: string, specifier: string) => {
  const base = join(dirname(from), specifier)
  for (const extension of extensions) {
    const file = base + extension
    if (existsSync(file) && extname(file)) return file
  }
  throw new Error(`${from}: cannot resolve '${specifier}'`)
}

const comments = /\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm

const importsOf = (source: string) =>
  [
    ...source
      .replace(comments, '')
      .matchAll(/(?:from|import)\s*['"]([^'"]+)['"]/g)
  ].map((match) => match[1])

const packageName = (specifier: string) => {
  const [scope, name] = specifier.split('/')
  return specifier.startsWith('@') ? `${scope}/${name}` : scope
}

const collect = (entry: string) => {
  const files = new Set<string>()
  const dependencies = new Set<string>()
  const visit = (file: string) => {
    if (files.has(file)) return
    files.add(file)
    if (extname(file) === '.css') return
    for (const specifier of importsOf(readFileSync(file, 'utf8'))) {
      if (!specifier.startsWith('.')) {
        if (!provided.has(packageName(specifier)))
          dependencies.add(packageName(specifier))
        continue
      }
      const target = resolveFile(file, specifier)
      if (!ignored.test(target)) visit(target)
    }
  }
  visit(entry)
  const example = join(dirname(entry), 'example.tsx')
  if (existsSync(example)) visit(example)
  return { files: [...files].sort(), dependencies: [...dependencies].sort() }
}

mkdirSync(out, { recursive: true })
const only = process.argv.slice(2)
const names = readdirSync(root).filter((name) =>
  existsSync(join(root, name, 'index.ts'))
)

if (!only.length)
  writeFileSync(join(out, 'index.json'), JSON.stringify(names, null, 2) + '\n')

for (const name of names) {
  if (only.length && !only.includes(name)) continue
  const { files, dependencies } = collect(join(root, name, 'index.ts'))
  const item = {
    name,
    dependencies,
    files: files.map((file) => ({
      path: relative(root, file),
      content: readFileSync(file, 'utf8')
    }))
  }
  writeFileSync(join(out, `${name}.json`), JSON.stringify(item, null, 2) + '\n')
  console.log(
    `${name}: ${files.length} files, deps: ${dependencies.join(', ') || '-'}`
  )
}
