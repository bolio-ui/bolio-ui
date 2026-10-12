import { useCallback, useEffect, useState } from 'react'

const useHash = (): [string, (value: string) => void] => {
  const [hash, setHashState] = useState('')

  useEffect(() => {
    const update = () => setHashState(window.location.hash)
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  const setHash = useCallback((value: string) => {
    window.location.hash = value
  }, [])

  return [hash, setHash]
}

export default useHash
