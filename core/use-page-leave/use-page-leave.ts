import { useEffect } from 'react'
import useLatest from '../utils/use-latest'

const usePageLeave = (onPageLeave: () => void) => {
  const latest = useLatest(onPageLeave)

  useEffect(() => {
    const handler = () => latest.current()
    document.documentElement.addEventListener('mouseleave', handler)
    return () =>
      document.documentElement.removeEventListener('mouseleave', handler)
  }, [latest])
}

export default usePageLeave
