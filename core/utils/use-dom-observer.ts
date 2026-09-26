import { MutableRefObject, useEffect } from 'react'
import useLatest from './use-latest'

const config = { attributes: false, childList: true, subtree: true }

const useDOMObserver = (
  ref: MutableRefObject<HTMLElement | null> | undefined,
  callback: MutationCallback = () => {}
) => {
  const latest = useLatest(callback)

  useEffect(() => {
    if (!ref || !ref.current) return
    let unmount = false
    const done: MutationCallback = (...params) => {
      if (unmount) return
      latest.current(...params)
    }
    const observer = new MutationObserver(done)
    observer.observe(ref.current, config)
    return () => {
      unmount = true
      observer.disconnect()
    }
  }, [ref, latest])
}

export default useDOMObserver
