import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

const isEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  return (
    keysA.length === keysB.length &&
    keysA.every((key) =>
      Object.is(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    )
  )
}

const useShallowEffect = (
  cb: EffectCallback,
  dependencies?: DependencyList
) => {
  const previous = useRef(dependencies)
  const version = useRef(0)

  if (
    !dependencies ||
    !previous.current ||
    dependencies.length !== previous.current.length ||
    !dependencies.every((dep, index) => isEqual(dep, previous.current?.[index]))
  ) {
    previous.current = dependencies
    version.current += 1
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cb, [version.current])
}

export default useShallowEffect
