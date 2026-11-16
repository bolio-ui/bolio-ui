import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
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
  // Body styles to put back when the drag ends
  const bodyStyle = useRef<{ cursor: string; userSelect: string } | null>(null)
  const [, setStartX, startXRef] = useCurrentState<number>(0)
  const [, setCurrentX, currentXRef] = useCurrentState<number>(0)

  // the listeners are added once, but call the current handlers
  const draggingRef = useLatest(draggingHandler)
  const dragStartRef = useLatest(dragStartHandler)
  const dragEndRef = useLatest(dragEndHandler)

  useEffect(() => {
    const element = elementRef && elementRef.current
    if (!element) return

    const restoreBody = () => {
      if (!bodyStyle.current) return
      document.body.style.cursor = bodyStyle.current.cursor
      document.body.style.userSelect = bodyStyle.current.userSelect
      bodyStyle.current = null
    }

    const getCustomEvent = () => ({
      startX: startXRef.current,
      currentX: currentXRef.current
    })

    const elementMouseDownHandler = (event: MouseEvent | TouchEvent) => {
      event.stopPropagation()
      event.stopImmediatePropagation()
      onDragging.current = true
      // The pointer leaves the handle while it follows the mouse, so the
      // cursor is held on the body for the whole drag instead of flickering
      // between the handle, the track and the page.
      const { style } = document.body
      bodyStyle.current = {
        cursor: style.cursor,
        userSelect: style.userSelect
      }
      style.cursor = 'grabbing'
      style.userSelect = 'none'
      // Start from where the pointer pressed, not from the edge of the handle,
      // so grabbing it off center does not make the value jump.
      const pressX =
        'touches' in event ? event.touches[0].clientX : event.clientX
      setStartX(pressX)
      setCurrentX(pressX)
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
      restoreBody()
      dragEndRef.current(getCustomEvent())
    }

    element.addEventListener('mousedown', elementMouseDownHandler)
    element.addEventListener('touchstart', elementMouseDownHandler)

    window.addEventListener('mousemove', globalDraggingHandler)
    window.addEventListener('touchmove', globalDraggingHandler)
    window.addEventListener('mouseup', globalDragEndHandler)
    window.addEventListener('touchend', globalDragEndHandler)

    return () => {
      restoreBody()
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
