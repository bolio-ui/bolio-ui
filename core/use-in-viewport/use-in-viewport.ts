import useIntersection from '../use-intersection'

export type UseInViewportResult<T extends HTMLElement> = {
  ref: (element: T | null) => void
  inViewport: boolean
}

const useInViewport = <
  T extends HTMLElement = HTMLElement
>(): UseInViewportResult<T> => {
  const { ref, entry } = useIntersection<T>()
  return { ref, inViewport: Boolean(entry?.isIntersecting) }
}

export default useInViewport
