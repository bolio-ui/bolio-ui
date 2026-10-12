import { RefObject } from 'react'
import useResizeObserver from '../use-resize-observer'

export type UseElementSizeResult<T extends HTMLElement> = {
  ref: RefObject<T | null>
  width: number
  height: number
}

const useElementSize = <
  T extends HTMLElement = HTMLElement
>(): UseElementSizeResult<T> => {
  const [ref, { width, height }] = useResizeObserver<T>()
  return { ref, width, height }
}

export default useElementSize
