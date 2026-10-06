import React, { MouseEvent, useRef } from 'react'
import useTheme from '../use-theme'
import CssTransition from './css-transition'
import useCurrentState from '../utils/use-current-state'
import useClasses from '../use-classes'
import styles from './backdrop.module.css'

interface Props {
  onClick?: (event: MouseEvent<HTMLElement>) => void
  visible?: boolean
  width?: string
  onContentClick?: (event: MouseEvent<HTMLElement>) => void
  backdropClassName?: string
  positionClassName?: string
  layerClassName?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type BackdropProps = Props & NativeAttrs

function BackdropComponent({
  children,
  onClick = () => {},
  visible = false,
  width,
  onContentClick,
  backdropClassName = '',
  positionClassName = '',
  layerClassName = '',
  style,
  ...props
}: React.PropsWithChildren<BackdropProps>) {
  const theme = useTheme()

  const [, setIsContentMouseDown, IsContentMouseDownRef] =
    useCurrentState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  const clickHandler = (event: MouseEvent<HTMLElement>) => {
    if (IsContentMouseDownRef.current) return
    // a click that comes from the content is not a click on the backdrop. It
    // has no mousedown when it is made with the keyboard, or by code
    if (contentRef.current?.contains(event.target as Node)) return
    if (onClick) onClick(event)
  }

  const mouseUpHandler = () => {
    if (!IsContentMouseDownRef.current) return
    const timer = setTimeout(() => {
      setIsContentMouseDown(false)
      clearTimeout(timer)
    }, 0)
  }

  return (
    <CssTransition name="backdrop-wrapper" visible={visible} clearTime={300}>
      <div
        className={useClasses(styles.backdrop, backdropClassName)}
        onClick={clickHandler}
        onMouseUp={mouseUpHandler}
        {...props}
        style={
          {
            '--backdrop-portal-opacity': theme.expressiveness.portalOpacity,
            ...style
          } as React.CSSProperties
        }
      >
        <div className={useClasses(styles.layer, layerClassName)} />
        <div
          ref={contentRef}
          onClick={onContentClick}
          className={useClasses(styles.position, positionClassName)}
          onMouseDown={() => setIsContentMouseDown(true)}
          style={{ width }}
        >
          {children}
        </div>
      </div>
    </CssTransition>
  )
}

BackdropComponent.displayName = 'BolioUIBackdrop'
const Backdrop = React.memo(BackdropComponent)
export default Backdrop
