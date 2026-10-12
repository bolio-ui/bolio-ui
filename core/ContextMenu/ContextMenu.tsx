import React, { useEffect, useRef, useState } from 'react'
import Menu from '../Menu'
import useClasses from '../use-classes'
import { withScale } from '../use-scale'
import styles from './ContextMenu.module.css'

interface Props {
  // the items of the menu, like `Menu.Item` and `Menu.Sub`
  content: React.ReactNode
  disabled?: boolean
  onVisibleChange?: (visible: boolean) => void
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type ContextMenuProps = Props & NativeAttrs

interface Point {
  x: number
  y: number
}

const ContextMenuComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ContextMenuProps>
>(
  (
    {
      content,
      disabled = false,
      onVisibleChange,
      className = '',
      children,
      onContextMenu,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    // where the menu opens, null while it is closed
    const [point, setPoint] = useState<Point | null>(null)
    const area = useRef<HTMLDivElement | null>(null)
    // the element that had the focus when the keyboard opened the menu
    const opener = useRef<HTMLElement | null>(null)

    const setRefs = (element: HTMLDivElement | null) => {
      area.current = element
      if (typeof ref === 'function') ref(element)
      else if (ref) ref.current = element
    }

    const change = (visible: boolean, next: Point | null = null) => {
      setPoint(visible ? next : null)
      if (onVisibleChange) onVisibleChange(visible)
    }

    const contextMenuHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      if (onContextMenu) onContextMenu(event)
      if (disabled || event.defaultPrevented) return
      event.preventDefault()
      opener.current = null
      change(true, { x: event.clientX, y: event.clientY })
    }

    // the Menu key and Shift+F10 open it below the element with the focus
    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) onKeyDown(event)
      if (disabled || event.defaultPrevented) return
      if (
        event.key !== 'ContextMenu' &&
        !(event.shiftKey && event.key === 'F10')
      )
        return
      event.preventDefault()
      const target = event.target as HTMLElement
      const rect = target.getBoundingClientRect()
      opener.current = target
      change(true, { x: rect.left, y: rect.bottom })
    }

    // like the menus of the system, it closes when the page scrolls
    const open = point !== null
    useEffect(() => {
      if (!open) return
      const close = () => {
        setPoint(null)
        if (onVisibleChange) onVisibleChange(false)
      }
      window.addEventListener('scroll', close, { capture: true, once: true })
      return () => window.removeEventListener('scroll', close, true)
    }, [open, onVisibleChange])

    return (
      <div
        ref={setRefs}
        className={useClasses(styles.area, className)}
        {...props}
        onContextMenu={contextMenuHandler}
        onKeyDown={keyDownHandler}
      >
        {children}
        {point && (
          // a new point opens a new menu, so it is placed there
          <Menu
            key={`${point.x}:${point.y}`}
            visible
            onVisibleChange={(visible) => change(visible)}
            style={{
              position: 'fixed',
              left: point.x,
              top: point.y,
              width: 0,
              height: 0
            }}
            // The menu returns the focus to its trigger when it closes, and
            // this one hands it on to where the keyboard opened the menu, or the area.
            trigger={
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className={styles.trigger}
                onFocus={() => (opener.current ?? area.current)?.focus()}
              />
            }
          >
            {content}
          </Menu>
        )}
      </div>
    )
  }
)

ContextMenuComponent.displayName = 'BolioUIContextMenu'
const ContextMenu = withScale(ContextMenuComponent)
export default ContextMenu
