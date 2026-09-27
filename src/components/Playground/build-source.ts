import { CORE_EXPORT_NAMES, ICON_EXPORT_NAMES } from './known-exports'

const CORE_PACKAGE = '@bolio-ui/core'
const ICONS_PACKAGE = '@bolio-ui/icons'

const indent = (text: string, spaces: number) => {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n')
}

// Reshapes the code actually run (a bare JSX expression, or the
// `() => {...}` value react-live already auto-instantiates) into a real,
// named component declaration — the same shape a page in an actual project
// would have.
const wrapAsComponent = (code: string): string => {
  const trimmed = code.trim()

  // Already a real declaration: function Demo() {...} / const Demo = () => {...}
  if (/^(?:export\s+default\s+)?(?:function|const)\s+[A-Z]/.test(trimmed)) {
    return trimmed
  }

  const arrowBody = trimmed.match(/^\(\)\s*=>\s*\{([\s\S]*)\}$/)
  if (arrowBody) return `function Demo() {${arrowBody[1]}}`

  return `function Demo() {\n  return (\n${indent(trimmed, 4)}\n  );\n}`
}

// Turns a Playground's `code` + `scope` into the file a reader could
// actually copy into their own project: real imports (derived from which
// `scope` keys the code references, resolved against @bolio-ui/core and
// @bolio-ui/icons's own export lists) plus a named component declaration.
export const buildPlaygroundSource = (
  code: string,
  scope: Record<string, unknown> = {}
): string => {
  const usedNames = Object.keys(scope).filter((name) =>
    new RegExp(`\\b${name}\\b`).test(code)
  )

  // A handful of names exist in both packages (Grid, Image, Table, ...);
  // core wins, since that's what every Playground on this site means by them.
  const coreNames = usedNames
    .filter((name) => CORE_EXPORT_NAMES.has(name))
    .sort()
  const iconNames = usedNames
    .filter(
      (name) => ICON_EXPORT_NAMES.has(name) && !CORE_EXPORT_NAMES.has(name)
    )
    .sort()

  const importLines: Array<string> = []
  if (/\bReact\./.test(code)) importLines.push("import React from 'react'")
  if (coreNames.length)
    importLines.push(
      `import { ${coreNames.join(', ')} } from '${CORE_PACKAGE}'`
    )
  if (iconNames.length)
    importLines.push(
      `import { ${iconNames.join(', ')} } from '${ICONS_PACKAGE}'`
    )

  const body = wrapAsComponent(code)
  return importLines.length ? `${importLines.join('\n')}\n\n${body}` : body
}

export default buildPlaygroundSource
