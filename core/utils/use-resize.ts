import { useEffect } from 'react'
import useLatest from './use-latest'

const useResize = (
  callback: () => unknown,
  immediatelyInvoke: boolean = true
): void => {
  const latest = useLatest(callback)

  useEffect(() => {
    const fn = () => latest.current()
    if (immediatelyInvoke) {
      fn()
    }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [immediatelyInvoke, latest])
}

export default useResize
