import React from 'react'
import useClasses from '../use-classes'
import useScale, { withScale } from '../use-scale'
import styles from './ColorSwatch.module.css'

interface Props {
  // any CSS color
  color: string
  // read by screen readers, the color by default
  label?: string
  // square with rounded corners instead of a circle
  square?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLSpanElement>, keyof Props>
export type ColorSwatchProps = Props & NativeAttrs

const ColorSwatchComponent = React.forwardRef<
  HTMLSpanElement,
  ColorSwatchProps
>(({ color, label, square = false, className = '', style, ...props }, ref) => {
  const { SCALES } = useScale()
  return (
    <span
      ref={ref}
      role="img"
      aria-label={label ?? color}
      className={useClasses(styles.swatch, square && styles.square, className)}
      style={
        {
          '--swatch-color': color,
          width: SCALES.width(1.5),
          height: SCALES.height(1.5),
          margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
          ...style
        } as React.CSSProperties
      }
      {...props}
    />
  )
})

ColorSwatchComponent.displayName = 'BolioUIColorSwatch'
const ColorSwatch = withScale(ColorSwatchComponent)
export default ColorSwatch
