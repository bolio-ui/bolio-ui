import React, { useId, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import {
  SegmentedControlContext,
  SegmentedControlValue
} from './SegmentedControlContext'
import styles from './SegmentedControl.module.css'

interface Props {
  value?: SegmentedControlValue
  initialValue?: SegmentedControlValue
  onChange?: (value: SegmentedControlValue) => void
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type SegmentedControlProps = Props & NativeAttrs

const SegmentedControlComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SegmentedControlProps>
>(
  (
    {
      value,
      initialValue,
      onChange,
      disabled = false,
      fullWidth = false,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const name = useId()
    const [selfValue, setSelfValue] = useState<
      SegmentedControlValue | undefined
    >(initialValue)
    const current = value !== undefined ? value : selfValue

    const providerValue = useMemo(
      () => ({
        name,
        value: current,
        disabled,
        select: (next: SegmentedControlValue) => {
          setSelfValue(next)
          if (onChange) onChange(next)
        }
      }),
      [name, current, disabled, onChange]
    )

    const groupStyle = {
      width: SCALES.width(1, fullWidth ? '100%' : 'fit-content'),
      height: SCALES.height(2.25),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      fontSize: SCALES.font(0.875),
      '--segmented-bg': theme.palette.accents_1,
      '--segmented-border': theme.palette.border,
      '--segmented-color': theme.palette.accents_5,
      '--segmented-hover-color': theme.palette.foreground,
      '--segmented-active-bg': theme.palette.background,
      '--segmented-active-color': theme.palette.foreground,
      '--segmented-shadow': theme.expressiveness.shadowSmall,
      '--segmented-focus': theme.palette.primary,
      '--segmented-radius': theme.layout.radius,
      ...style
    } as React.CSSProperties

    return (
      <SegmentedControlContext.Provider value={providerValue}>
        <div
          ref={ref}
          role="radiogroup"
          aria-disabled={disabled || undefined}
          className={useClasses(styles.segmented, className)}
          {...props}
          style={groupStyle}
        >
          {children}
        </div>
      </SegmentedControlContext.Provider>
    )
  }
)

SegmentedControlComponent.displayName = 'BolioUISegmentedControl'
const SegmentedControl = withScale(SegmentedControlComponent)
export default SegmentedControl
