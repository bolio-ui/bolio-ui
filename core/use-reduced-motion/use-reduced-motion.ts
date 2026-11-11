import useMatchMedia from '../utils/use-match-media'

const QUERY = '(prefers-reduced-motion: reduce)'

// Read at the first render, so an animation never starts for a user who
// asked for none (Recharts keeps its labels hidden until an animation ends).
const useReducedMotion = () =>
  useMatchMedia(
    QUERY,
    typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(QUERY).matches
  )

export default useReducedMotion
