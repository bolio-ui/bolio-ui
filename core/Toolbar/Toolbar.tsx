import React, { useEffect, useRef } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Toolbar.module.css'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type ToolbarProps = Props & NativeAttrs

const ITEMS = 'button, a[href], input, select, textarea'

const ToolbarComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ToolbarProps>
>(
  (
    {
      orientation = 'horizontal',
      className = '',
      children,
      onKeyDown,
      onFocus,
      style,
      ...props
    },
    innerRef
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const ref = useRef<HTMLDivElement | null>(null)
    // the item that stays in the Tab order, the one that had focus last
    const current = useRef<Element | null>(null)

    const getItems = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []
      ).filter(
        (item) =>
          !(item as HTMLButtonElement).disabled &&
          item.getAttribute('role') !== 'separator'
      )

    // only one item takes Tab, the arrow keys move between them
    useEffect(() => {
      const items = getItems()
      const active = items.find((item) => item === current.current) ?? items[0]
      items.forEach((item) =>
        item.setAttribute('tabindex', item === active ? '0' : '-1')
      )
    })

    const setRef = (node: HTMLDivElement | null) => {
      ref.current = node
      if (typeof innerRef === 'function') innerRef(node)
      else if (innerRef) innerRef.current = node
    }

    const focusHandler = (event: React.FocusEvent<HTMLDivElement>) => {
      if (onFocus) onFocus(event)
      const items = getItems()
      if (items.includes(event.target as HTMLElement)) {
        current.current = event.target
        items.forEach((item) =>
          item.setAttribute('tabindex', item === event.target ? '0' : '-1')
        )
      }
    }

    const keyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) onKeyDown(event)
      if (event.defaultPrevented) return
      const vertical = orientation === 'vertical'
      const items = getItems()
      const index = items.indexOf(event.target as HTMLElement)
      if (index === -1) return
      let next = -1
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight'))
        next = (index + 1) % items.length
      else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft'))
        next = (index - 1 + items.length) % items.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = items.length - 1
      if (next === -1) return
      event.preventDefault()
      items[next].focus()
    }

    const toolbarStyle = {
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--toolbar-border': theme.palette.border,
      '--toolbar-radius': theme.layout.radius,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={setRef}
        role="toolbar"
        aria-orientation={orientation}
        className={useClasses(styles.toolbar, styles[orientation], className)}
        onKeyDown={keyHandler}
        onFocus={focusHandler}
        {...props}
        style={toolbarStyle}
      >
        {children}
      </div>
    )
  }
)

ToolbarComponent.displayName = 'BolioUIToolbar'
const Toolbar = withScale(ToolbarComponent)
export default Toolbar
