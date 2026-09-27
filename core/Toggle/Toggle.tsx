import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { getColors } from './styles'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Toggle.module.css'

export type ToggleTypes = NormalTypes
export interface ToggleEventTarget {
  checked: boolean
}
export interface ToggleEvent {
  target: ToggleEventTarget
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: React.ChangeEvent
}

interface Props {
  checked?: boolean
  initialChecked?: boolean
  onChange?: (ev: ToggleEvent) => void
  disabled?: boolean
  type?: ToggleTypes
  className?: string
}

type NativeAttrs = Omit<React.LabelHTMLAttributes<AnyElement>, keyof Props>
export type ToggleProps = Props & NativeAttrs

export type ToggleSize = {
  width: string
  height: string
}

const ToggleComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<ToggleProps>
>(
  (
    {
      initialChecked = false,
      checked,
      disabled = false,
      onChange,
      type = 'default' as ToggleTypes,
      className = '',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [selfChecked, setSelfChecked] = useState<boolean>(initialChecked)
    const classes = useClasses(styles.toggle, {
      [styles.checked]: selfChecked,
      [styles.disabled]: disabled
    })

    const changeHandle = useCallback(
      (ev: React.ChangeEvent) => {
        if (disabled) return
        const selfEvent: ToggleEvent = {
          target: {
            checked: !selfChecked
          },
          stopPropagation: ev.stopPropagation,
          preventDefault: ev.preventDefault,
          nativeEvent: ev
        }

        setSelfChecked(!selfChecked)
        if (onChange) onChange(selfEvent)
      },
      [disabled, selfChecked, onChange]
    )

    const { bg } = useMemo(
      () => getColors(theme.palette, type),
      [theme.palette, type]
    )

    useEffect(() => {
      if (checked === undefined) return
      setSelfChecked(checked)
    }, [checked])

    const labelStyle = {
      cursor: disabled ? 'not-allowed' : 'pointer',
      '--toggle-font-size': SCALES.font(1),
      '--toggle-height': SCALES.height(1),
      width: SCALES.width(1.75),
      height: 'var(--toggle-height)',
      padding: `${SCALES.pt(0.1875)} ${SCALES.pr(0)} ${SCALES.pb(0.1875)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--toggle-focus-color': theme.palette.primary,
      '--toggle-bg': theme.palette.accents_2,
      '--toggle-inner-bg': theme.palette.accents_1,
      '--toggle-disabled-border': theme.palette.accents_2,
      '--toggle-disabled-bg': theme.palette.accents_1,
      '--toggle-disabled-inner-bg': theme.palette.accents_2,
      '--toggle-disabled-checked-border': theme.palette.accents_4,
      '--toggle-disabled-checked-bg': theme.palette.accents_4,
      '--toggle-checked-bg': bg
    } as React.CSSProperties

    return (
      <label className={`${styles.label} ${className}`.trim()} {...props} style={labelStyle}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          disabled={disabled}
          checked={selfChecked}
          onChange={changeHandle}
          className={styles.input}
        />
        <div className={classes}>
          <span className={styles.inner} />
        </div>
      </label>
    )
  }
)

ToggleComponent.displayName = 'BolioUIToggle'
const Toggle = withScale(ToggleComponent)
export default Toggle
