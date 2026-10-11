import { useEffect, useState } from 'react'

const useMatchMedia = (query: string, initialValue = false) => {
  const [matches, setMatches] = useState(initialValue)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}

export default useMatchMedia
