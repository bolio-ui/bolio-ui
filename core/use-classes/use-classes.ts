export type classNamesObject = Record<
  string,
  boolean | string | number | null | undefined
>
export type className =
  string | classNamesObject | null | undefined | boolean | number

const classObjectToString = (className: classNamesObject) => {
  const keys = Object.keys(className)
  const len = keys.length
  let str = ''
  for (let index = 0; index < len; index++) {
    const key = keys[index]
    const val = className[keys[index]]
    if (!val) continue
    str = str ? `${str} ${String(key)}` : String(key)
  }
  return str
}

const isObjectClassName = (value: className): value is classNamesObject =>
  typeof value === 'object' && !Array.isArray(value)

// A plain function, so it can be called in loops and callbacks. It is
// exported as `useClasses` too, the name the package has always used.
export const joinClasses = (...classNames: Array<className>): string => {
  const len = classNames.length
  let classes = ''
  if (len === 0) return classes
  for (let index = 0; index < len; index++) {
    const val = classNames[index]
    if (!val) continue
    if (isObjectClassName(val)) {
      classes += ` ${classObjectToString(val)}`
    } else {
      classes += ` ${String(val).trim()}`
    }
  }
  return classes.trim()
}

const useClasses = joinClasses

export default useClasses
