import { useEffect, useState } from 'react'

const useScrollDirection = (): 'up' | 'down' => {
  const [direction, setDirection] = useState<'up' | 'down'>('up')

  useEffect(() => {
    let previous = window.scrollY
    const update = () => {
      const current = window.scrollY
      if (current !== previous) setDirection(current > previous ? 'down' : 'up')
      previous = current
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return direction
}

export default useScrollDirection
