import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import useUncontrolled from '../use-uncontrolled'
import useRadialMove from '../use-radial-move'
import styles from './AngleSlider.module.css'

interface Props {
  // degrees, from 0 at the top and growing clockwise
  value?: number
  initialValue?: number
  onChange?: (value: number) => void
  // called when the pointer is released
  onChangeEnd?: (value: number) => void
  step?: number
  // pixels of the diameter
  size?: number
  // the text in the center, the value with a degree sign by default
  formatLabel?: (value: number) => React.ReactNode
  withLabel?: boolean
  disabled?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'onChange' | 'defaultValue'
>
export type AngleSliderProps = Props & NativeAttrs

const wrap = (value: number) => ((value % 360) + 360) % 360

const AngleSliderComponent = React.forwardRef<HTMLDivElement, AngleSliderProps>(
  (
    {
      value: customValue,
      initialValue = 0,
      onChange,
      onChangeEnd,
      step = 1,
      size = 120,
      formatLabel = (value) => `${value}°`,
      withLabel = true,
      disabled = false,
      className = '',
      style,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [value, setValue] = useUncontrolled<number>({
      value: customValue,
      defaultValue: initialValue,
      onChange
    })
    const { ref: trackRef, active } = useRadialMove<HTMLDivElement>(
      (next) => !disabled && setValue(wrap(next)),
      { step, onChangeEnd: (next) => !disabled && onChangeEnd?.(wrap(next)) }
    )

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || disabled) return
      const targets: Record<string, number> = {
        ArrowUp: value + step,
        ArrowRight: value + step,
        ArrowDown: value - step,
        ArrowLeft: value - step,
        PageUp: value + step * 10,
        PageDown: value - step * 10,
        Home: 0,
        End: 360 - step
      }
      if (!(event.key in targets)) return
      event.preventDefault()
      const next = wrap(targets[event.key])
      setValue(next)
      onChangeEnd?.(next)
    }

    const sliderStyle = {
      '--angle-slider-size': `${size}px`,
      '--angle-slider-color': theme.palette.primary,
      '--angle-slider-track': theme.palette.accents_2,
      '--angle-slider-border': theme.palette.border,
      '--angle-slider-text': theme.palette.foreground,
      '--angle-slider-rotation': `${value}deg`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.root, className)}
        style={sliderStyle}
      >
        <div
          ref={trackRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={360 - step}
          aria-valuenow={value}
          aria-valuetext={`${value} degrees`}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          className={joinClasses(styles.track, {
            [styles.active]: active,
            [styles.disabled]: disabled
          })}
          onKeyDown={keyDownHandler}
          {...props}
        >
          <div className={styles.hand} aria-hidden="true">
            <div className={styles.thumb} />
          </div>
          {withLabel && (
            <span className={styles.label} aria-hidden="true">
              {formatLabel(value)}
            </span>
          )}
        </div>
      </div>
    )
  }
)

AngleSliderComponent.displayName = 'BolioUIAngleSlider'
const AngleSlider = withScale(AngleSliderComponent)
export default AngleSlider
