import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import useScale from '../use-scale'
import useTheme from '../use-theme'
import CssTransition from '../Shared/css-transition'
import { isChildElement } from '../utils/collections'
import { DrawerPlacement, getDrawerTransform } from './helper'
import useClasses from '../use-classes'
import styles from './DrawerWrapper.module.css'
import { getSurface } from '../utils/surface'

const placementClasses: Record<DrawerPlacement, string> = {
  top: styles.top,
  left: styles.left,
  bottom: styles.bottom,
  right: styles.right
}

interface Props {
  className?: string
  visible?: boolean
  placement: DrawerPlacement
}

export type DrawerWrapperProps = Props

const DrawerWrapper = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<DrawerWrapperProps>
>(({ className = '', children, visible = false, placement, ...props }, ref) => {
  const theme = useTheme()
  const surface = getSurface(theme, theme.expressiveness.shadowLarge)
  const { SCALES } = useScale()

  const modalContent = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => modalContent.current as HTMLDivElement)
  const tabStart = useRef<HTMLDivElement>(null)
  const tabEnd = useRef<HTMLDivElement>(null)
  const transform = useMemo(() => getDrawerTransform(placement), [placement])
  const classes = useClasses(
    styles.wrapper,
    placementClasses[placement],
    className
  )

  const wrapperStyle = {
    backgroundColor: surface.bg,
    color: theme.palette.foreground,
    borderRadius: `calc(3 * ${theme.layout.radius})`,
    boxShadow: surface.shadow,
    fontSize: SCALES.font(1),
    '--drawer-wrapper-padding-left': SCALES.pl(1.3125),
    '--drawer-wrapper-padding-right': SCALES.pr(1.3125),
    padding: `${SCALES.pt(1.3125)} var(--drawer-wrapper-padding-right) ${SCALES.pb(1.3125)} var(--drawer-wrapper-padding-left)`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--drawer-wrapper-top-bottom-width': SCALES.width(1, '100%'),
    '--drawer-wrapper-top-bottom-height': SCALES.height(1, 'auto'),
    '--drawer-wrapper-left-right-width': SCALES.width(1, 'auto'),
    '--drawer-wrapper-left-right-height': SCALES.height(1, '100%'),
    '--drawer-wrapper-transform-initial': transform.initial,
    '--drawer-wrapper-transform-hidden': transform.hidden,
    '--drawer-wrapper-transform-visible': transform.visible
  } as React.CSSProperties

  useEffect(() => {
    if (!visible) return
    const activeElement = document.activeElement
    const isChild = isChildElement(modalContent.current, activeElement)
    if (isChild) return
    if (tabStart.current) tabStart.current.focus()
  }, [visible])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isTabDown = event.keyCode === 9
    if (!visible || !isTabDown) return
    const activeElement = document.activeElement
    if (event.shiftKey) {
      if (activeElement === tabStart.current) {
        if (tabEnd.current) tabEnd.current.focus()
      }
    } else {
      if (activeElement === tabEnd.current) {
        if (tabStart.current) tabStart.current.focus()
      }
    }
  }

  return (
    <CssTransition name="wrapper" visible={visible} clearTime={300}>
      <div
        className={classes}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        ref={modalContent}
        {...props}
        style={wrapperStyle}
      >
        <div
          tabIndex={0}
          className={styles.hideTab}
          aria-hidden="true"
          ref={tabStart}
        />
        {children}
        <div
          tabIndex={0}
          className={styles.hideTab}
          aria-hidden="true"
          ref={tabEnd}
        />
      </div>
    </CssTransition>
  )
})

DrawerWrapper.displayName = 'BolioUIDrawerWrapper'
export default DrawerWrapper
