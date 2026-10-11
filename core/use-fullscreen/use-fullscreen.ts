import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

export type UseFullscreenResult<T extends HTMLElement> = {
  ref: RefObject<T | null>
  fullscreen: boolean
  enter: () => Promise<void>
  exit: () => Promise<void>
  toggle: () => Promise<void>
}

const useFullscreen = <
  T extends HTMLElement = HTMLElement
>(): UseFullscreenResult<T> => {
  const ref = useRef<T>(null)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])

  const enter = useCallback(async () => {
    const node = ref.current ?? document.documentElement
    await node.requestFullscreen?.()
  }, [])

  const exit = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
  }, [])

  const toggle = useCallback(
    () => (document.fullscreenElement ? exit() : enter()),
    [enter, exit]
  )

  return { ref, fullscreen, enter, exit, toggle }
}

export default useFullscreen
