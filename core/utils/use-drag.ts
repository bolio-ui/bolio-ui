import { RefObject, useEffect, useRef } from 'react'
import useCurrentState from './use-current-state'
import useLatest from './use-latest'

export type DraggingEvent = {
  startX: number
  currentX: number
}

export type DraggingHandler = (event: DraggingEvent) => void

const useDrag = (
  elementRef: RefObject<HTMLElement | null> | null,
  draggingHandler: DraggingHandler = () => {},
  dragStartHandler: DraggingHandler = () => {},
  dragEndHandler: DraggingHandler = () => {}
) => {
  const onDragging = useRef<boolean>(false)
  const [, setStartX, startXRef] = useCurrentState<number>(0)
  const [, setCurrentX, currentXRef] = useCurrentState<number>(0)

  // the listeners are added once, but call the current handlers
  const draggingRef = useLatest(draggingHandler)
  const dragStartRef = useLatest(dragStartHandler)
  const dragEndRef = useLatest(dragEndHandler)

  useEffect(() => {
    const element = elementRef && elementRef.current
    if (!element) return

    const getCustomEvent = () => ({
      startX: startXRef.current,
      currentX: currentXRef.current
    })

    const elementMouseDownHandler = (event: MouseEvent | TouchEvent) => {
      event.stopPropagation()
      event.stopImmediatePropagation()
      onDragging.current = true
      setStartX(element.getBoundingClientRect().x)
      dragStartRef.current(getCustomEvent())
    }

    const globalDraggingHandler = (event: MouseEvent | TouchEvent) => {
      if (!onDragging.current) return
      if (event.type === 'touchmove') {
        setCurrentX((event as TouchEvent).changedTouches[0].clientX)
      } else {
        setCurrentX((event as MouseEvent).clientX)
      }
      draggingRef.current(getCustomEvent())
    }
    const globalDragEndHandler = () => {
      if (!onDragging.current) return
      onDragging.current = false
      dragEndRef.current(getCustomEvent())
    }

    element.addEventListener('mousedown', elementMouseDownHandler)
    element.addEventListener('touchstart', elementMouseDownHandler)

    window.addEventListener('mousemove', globalDraggingHandler)
    window.addEventListener('touchmove', globalDraggingHandler)
    window.addEventListener('mouseup', globalDragEndHandler)
    window.addEventListener('touchend', globalDragEndHandler)

    return () => {
      window.removeEventListener('mousemove', globalDraggingHandler)
      window.removeEventListener('touchmove', globalDraggingHandler)
      window.removeEventListener('mouseup', globalDragEndHandler)
      window.removeEventListener('touchend', globalDragEndHandler)

      element.removeEventListener('mousedown', elementMouseDownHandler)
      element.removeEventListener('touchstart', elementMouseDownHandler)
    }
  }, [
    elementRef,
    startXRef,
    currentXRef,
    setStartX,
    setCurrentX,
    draggingRef,
    dragStartRef,
    dragEndRef
  ])
}

export default useDrag
