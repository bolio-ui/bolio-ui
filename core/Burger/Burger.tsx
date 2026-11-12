import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Burger.module.css'

interface Props {
  // true draws a cross, false three lines
  opened?: boolean
  // accessible name, such as "Open menu"
  label: string
  color?: string
  className?: string
}

type NativeAttrs = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof Props
>
export type BurgerProps = Props & NativeAttrs

const BurgerComponent = React.forwardRef<HTMLButtonElement, BurgerProps>(
  ({ opened = false, label, color, className = '', style, ...props }, ref) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const burgerStyle = {
      '--burger-size': SCALES.height(2.25),
      '--burger-color': color || theme.palette.foreground,
      '--burger-radius': theme.layout.radius,
      '--burger-focus': theme.palette.primary,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-expanded={opened}
        className={useClasses(
          styles.burger,
          { [styles.opened]: opened },
          className
        )}
        style={burgerStyle}
        {...props}
      >
        <span className={styles.lines} aria-hidden="true" />
      </button>
    )
  }
)

BurgerComponent.displayName = 'BolioUIBurger'
const Burger = withScale(BurgerComponent)
export default Burger
