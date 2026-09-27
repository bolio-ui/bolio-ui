import React, { MutableRefObject, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import usePortal from '../utils/use-portal'
import useResize from '../utils/use-resize'
import CssTransition from './css-transition'
import useClickAnyWhere from '../utils/use-click-anywhere'
import useLatest from '../utils/use-latest'
import useDOMObserver from '../utils/use-dom-observer'
import logWarning from '../utils/log-warning'
import { getRefRect } from '../utils/layouts'

interface Props {
  parent?: MutableRefObject<HTMLElement | null> | undefined
  visible: boolean
  disableMatchWidth?: boolean
  getPopupContainer?: () => HTMLElement | null
}

interface ReactiveDomReact {
  top: number
  left: number
  right: number
  width: number
}

const defaultRect: ReactiveDomReact = {
  top: -1000,
  left: -1000,
  right: -1000,
  width: 0
}

const Dropdown: React.FC<React.PropsWithChildren<Props>> = React.memo(
  ({ children, parent, visible, disableMatchWidth, getPopupContainer }) => {
    const el = usePortal('dropdown', getPopupContainer)
    const [rect, setRect] = useState<ReactiveDomReact>(defaultRect)

    /* istanbul ignore next */
    if (parent && process.env.NODE_ENV !== 'production') {
      if (getPopupContainer && getPopupContainer()) {
        const el = getPopupContainer()
        const style = window.getComputedStyle(el as HTMLDivElement)
        if (style.position === 'static') {
          logWarning(
            'The element specified by "getPopupContainer" must have "position" set.'
          )
        }
      }
    }

    const updateRect = () => {
      if (!parent) return
      const {
        top,
        left,
        right,
        width: nativeWidth
      } = getRefRect(parent, getPopupContainer)
      setRect({ top, left, right, width: nativeWidth })
    }

    useResize(updateRect)
    useClickAnyWhere(() => {
      const { top, left } = getRefRect(parent, getPopupContainer)
      const shouldUpdatePosition = top !== rect.top || left !== rect.left
      if (!shouldUpdatePosition) return
      updateRect()
    })
    useDOMObserver(parent, () => {
      updateRect()
    })
    const latestUpdate = useLatest(updateRect)
    useEffect(() => {
      const element = parent && parent.current
      if (!element) return
      const listener = () => latestUpdate.current()
      element.addEventListener('mouseenter', listener)
      /* istanbul ignore next */
      return () => element.removeEventListener('mouseenter', listener)
    }, [parent, latestUpdate])

    const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
      event.preventDefault()
    }
    const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
    }

    // after every hook: there is nothing to place without a parent
    if (!parent || !el) return null

    const dropdownStyle: React.CSSProperties = {
      position: 'absolute',
      top: rect.top + 2,
      left: rect.left,
      zIndex: 1100,
      ...(disableMatchWidth
        ? { minWidth: rect.width }
        : { width: rect.width })
    }

    return createPortal(
      <CssTransition visible={visible}>
        <div
          className=""
          onClick={clickHandler}
          onMouseDown={mouseDownHandler}
          style={dropdownStyle}
        >
          {children}
        </div>
      </CssTransition>,
      el
    )
  }
)

Dropdown.displayName = 'BolioUIDropdown'

export default Dropdown
