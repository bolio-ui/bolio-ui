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
      ...props
    },
    ref
  ) => {
    // where the menu opens, null while it is closed
    const [point, setPoint] = useState<Point | null>(null)
    const area = useRef<HTMLDivElement | null>(null)

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
      change(true, { x: event.clientX, y: event.clientY })
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
            // this one hands it to the area.
            trigger={
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className={styles.trigger}
                onFocus={() => area.current?.focus()}
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
