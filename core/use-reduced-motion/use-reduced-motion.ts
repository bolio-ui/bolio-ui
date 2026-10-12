import useMatchMedia from '../utils/use-match-media'

const useReducedMotion = () => useMatchMedia('(prefers-reduced-motion: reduce)')

export default useReducedMotion
