import useMatchMedia from '../utils/use-match-media'

const useColorScheme = (): 'light' | 'dark' =>
  useMatchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'

export default useColorScheme
