import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useCheckbox } from './CheckboxContext'
import CheckboxIcon from './CheckboxIcon'
import logWarning from '../utils/log-warning'
import { NormalTypes } from '../utils/prop-types'
import { getColors } from './styles'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Checkbox.module.css'

export type CheckboxTypes = NormalTypes
export interface CheckboxEventTarget {
  checked: boolean
}
export interface CheckboxEvent {
  target: CheckboxEventTarget
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: React.ChangeEvent
}

interface Props {
  checked?: boolean
  disabled?: boolean
  type?: CheckboxTypes
  initialChecked?: boolean
  onChange?: (e: CheckboxEvent) => void
  className?: string
  value?: string
}

type NativeAttrs = Omit<React.InputHTMLAttributes<AnyElement>, keyof Props>
export type CheckboxProps = Props & NativeAttrs

const CheckboxComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<CheckboxProps>
>(
  (
    {
      checked,
      initialChecked = false,
      disabled = false,
      onChange,
      className = '',
      children,
      type = 'default' as CheckboxTypes,
      value = '',
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [selfChecked, setSelfChecked] = useState<boolean>(initialChecked)
    const { updateState, inGroup, disabledAll, values } = useCheckbox()
    const isDisabled = inGroup ? disabledAll || disabled : disabled
    const classes = useClasses(styles.checkbox, className)

    if (inGroup && checked) {
      logWarning(
        'Remove props "checked" when [Checkbox] component is in the group.',
        'Checkbox'
      )
    }
    useEffect(() => {
      if (!inGroup) return
      const next = values.includes(value)
      if (next === selfChecked) return
      setSelfChecked(next)
    }, [inGroup, selfChecked, value, values])

    const fill = useMemo(
      () => getColors(theme.palette, type),
      [theme.palette, type]
    )

    const changeHandle = useCallback(
      (ev: React.ChangeEvent) => {
        if (isDisabled) return
        const selfEvent: CheckboxEvent = {
          target: {
            checked: !selfChecked
          },
          stopPropagation: ev.stopPropagation,
          preventDefault: ev.preventDefault,
          nativeEvent: ev
        }
        if (inGroup && updateState) {
          if (updateState) updateState(value, !selfChecked)
        }

        setSelfChecked(!selfChecked)
        if (onChange) onChange(selfEvent)
      },
      [isDisabled, selfChecked, inGroup, updateState, onChange, value]
    )

    useEffect(() => {
      if (checked === undefined) return
      setSelfChecked(checked)
    }, [checked])

    const checkboxStyle = {
      '--checkbox-size': SCALES.font(1),
      '--checkbox-focus-color': theme.palette.primary,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.75 : 1,
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'var(--checkbox-size)'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
    } as React.CSSProperties

    return (
      <label className={classes} style={checkboxStyle}>
        <CheckboxIcon fill={fill} disabled={isDisabled} checked={selfChecked} />
        <input
          ref={ref}
          type="checkbox"
          disabled={isDisabled}
          checked={selfChecked}
          onChange={changeHandle}
          {...props}
          className={styles.input}
        />
        <span
          className={styles.text}
          style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
        >
          {children}
        </span>
      </label>
    )
  }
)

CheckboxComponent.displayName = 'BolioUICheckbox'
const Checkbox = withScale(CheckboxComponent)
export default Checkbox
