import { MutableRefObject, useEffect, useRef } from 'react'

// A ref that holds the value of the latest render, for code that is set up
// once (a listener, a timer, an effect that runs when something else
// changes) but has to call the current callback or read the current props.
// Call it before the effects that read the ref: they run in order, so the
// ref is up to date when they do.
const useLatest = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref
}

export default useLatest
