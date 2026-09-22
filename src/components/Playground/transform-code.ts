// react-live evaluates the code directly, so it can't resolve real `import`
// statements — every value it needs has to come from the `scope` prop
// instead. This lets an example still be *written* (and copy/pasted) as a
// real file, imports included, while running: import lines are stripped
// (their names are expected to already be in `scope`, same as today) and,
// when the snippet declares a component instead of ending in a bare JSX
// expression, a call to react-live's own `render()` is appended for it.
export const transformLiveCode = (rawCode: string): string => {
  // Matches single- and multi-line `import ... from '...'` as well as bare
  // `import '...'` side-effect imports.
  const code = rawCode
    .replace(/^\s*import\s+(?:[\s\S]*?from\s*)?['"][^'"]+['"]\s*;?\s*$/gm, '')
    .trim()

  // A top-level `function Name` or `const Name =` component declaration:
  // render the last one declared, passing the function itself — react-live
  // already auto-instantiates a function result as `<Name />`, the same way
  // it does for a bare `() => {...}` example today.
  const declarations = [
    ...code.matchAll(/(?:^|\n)\s*(?:function|const)\s+([A-Z]\w*)/g)
  ]
  const lastDeclared = declarations[declarations.length - 1]?.[1]
  if (lastDeclared) return `${code}\nrender(${lastDeclared})`

  // A bare JSX expression or arrow function, exactly like before.
  return `render(${code})`
}

export default transformLiveCode
