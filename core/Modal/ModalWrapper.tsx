import React, { useEffect, useImperativeHandle, useRef } from 'react'
import useTheme from '../use-theme'
import CssTransition from '../Shared/css-transition'
import { isChildElement } from '../utils/collections'
import useScale from '../use-scale'
import useClasses from '../use-classes'
import styles from './ModalWrapper.module.css'

interface Props {
  className?: string
  visible?: boolean
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type ModalWrapperProps = Props & NativeAttrs

const ModalWrapper = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ModalWrapperProps>
>(({ className = '', children, visible = false, style, ...props }, ref) => {
  const theme = useTheme()
  const { SCALES } = useScale()
  const modalContent = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => modalContent.current as HTMLDivElement)
  const tabStart = useRef<HTMLDivElement>(null)
  const tabEnd = useRef<HTMLDivElement>(null)

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

  const wrapperStyle = {
    backgroundColor: theme.palette.background,
    color: theme.palette.foreground,
    borderRadius: theme.layout.radius,
    boxShadow: theme.expressiveness.shadowLarge,
    fontSize: SCALES.font(1),
    height: SCALES.height(1, 'auto'),
    '--modal-wrapper-padding-left': SCALES.pl(1.3125),
    '--modal-wrapper-padding-right': SCALES.pr(1.3125),
    padding: `${SCALES.pt(1.3125)} var(--modal-wrapper-padding-right) ${SCALES.pb(1.3125)} var(--modal-wrapper-padding-left)`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  } as React.CSSProperties

  return (
    <CssTransition name="wrapper" visible={visible} clearTime={300}>
      <div
        className={useClasses(styles.wrapper, className)}
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

ModalWrapper.displayName = 'BolioUIModalWrapper'
export default ModalWrapper
