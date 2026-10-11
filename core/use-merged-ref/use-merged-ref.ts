import { MutableRefObject, Ref, useCallback } from 'react'

type PossibleRef<T> = Ref<T> | undefined

const assignRef = <T>(ref: PossibleRef<T>, value: T | null) => {
  if (typeof ref === 'function') ref(value)
  else if (ref) (ref as MutableRefObject<T | null>).current = value
}

export const mergeRefs =
  <T>(...refs: PossibleRef<T>[]) =>
  (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node))
  }

const useMergedRef = <T>(...refs: PossibleRef<T>[]) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(mergeRefs(...refs), refs)

export default useMergedRef
