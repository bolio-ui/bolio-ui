import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { AnyElement } from '../utils/types'
import styles from './Keyboard.module.css'

interface Props {
  command?: boolean
  shift?: boolean
  option?: boolean
  ctrl?: boolean
  className?: string
}

type NativeAttrs = Omit<React.KeygenHTMLAttributes<AnyElement>, keyof Props>
export type KeyboardProps = Props & NativeAttrs

const KeyboardComponent = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<KeyboardProps>
>(
  (
    {
      command = false,
      shift = false,
      option = false,
      ctrl = false,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const kbdStyle: React.CSSProperties = {
      color: theme.palette.accents_5,
      backgroundColor: theme.palette.accents_1,
      fontFamily: theme.font.sans,
      borderRadius: theme.layout.radius,
      border: `1px solid ${theme.palette.accents_2}`,
      fontSize: SCALES.font(0.875),
      width: SCALES.width(1, 'fit-content'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0.34)} ${SCALES.pb(0)} ${SCALES.pl(0.34)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <kbd
        ref={ref}
        className={`${styles.kbd} ${className}`.trim()}
        {...props}
        style={kbdStyle}
      >
        {command && <span>⌘</span>}
        {shift && <span>⇧</span>}
        {option && <span>⌥</span>}
        {ctrl && <span>⌃</span>}
        {children && <span>{children}</span>}
      </kbd>
    )
  }
)

KeyboardComponent.displayName = 'BolioUIKeyboard'
const Keyboard = withScale(KeyboardComponent)
export default Keyboard
