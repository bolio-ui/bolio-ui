import React, { useEffect, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import { useRadioContext } from './RadioContext'
import RadioDescription from './RadioDescription'
import { pickChild } from '../utils/collections'
import logWarning from '../utils/log-warning'
import { NormalTypes } from '../utils/prop-types'
import { getColors } from './styles'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Radio.module.css'

export type RadioTypes = NormalTypes
export interface RadioEventTarget {
  checked: boolean
}
export interface RadioEvent {
  target: RadioEventTarget
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: React.ChangeEvent
}

interface Props {
  checked?: boolean
  value?: string | number
  type?: RadioTypes
  className?: string
  disabled?: boolean
  onChange?: (e: RadioEvent) => void
}

type NativeAttrs = Omit<React.InputHTMLAttributes<AnyElement>, keyof Props>
export type RadioProps = Props & NativeAttrs

const RadioComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<RadioProps>
>(
  (
    {
      className = '',
      checked,
      onChange,
      disabled = false,
      type = 'default' as RadioTypes,
      value: radioValue,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [selfChecked, setSelfChecked] = useState<boolean>(!!checked)
    const {
      value: groupValue,
      disabledAll,
      inGroup,
      updateState
    } = useRadioContext()
    const [withoutDescChildren, DescChildren] = pickChild(
      children,
      RadioDescription
    )

    if (inGroup) {
      if (checked !== undefined) {
        logWarning('Remove props "checked" if in the Radio.Group.', 'Radio')
      }
      if (radioValue === undefined) {
        logWarning(
          'Props "value" must be deinfed if in the Radio.Group.',
          'Radio'
        )
      }
    }

    useEffect(() => {
      if (!inGroup) return
      setSelfChecked(groupValue === radioValue)
    }, [inGroup, groupValue, radioValue])

    const { label, border, bg } = useMemo(
      () => getColors(theme.palette, type),
      [theme.palette, type]
    )

    const isDisabled = useMemo(
      () => disabled || disabledAll,
      [disabled, disabledAll]
    )

    const changeHandler = (event: React.ChangeEvent) => {
      if (isDisabled) return
      const selfEvent: RadioEvent = {
        target: {
          checked: !selfChecked
        },
        stopPropagation: event.stopPropagation,
        preventDefault: event.preventDefault,
        nativeEvent: event
      }
      setSelfChecked(!selfChecked)
      if (inGroup) {
        if (updateState) updateState(radioValue as string | number)
      }
      if (onChange) onChange(selfEvent)
    }

    useEffect(() => {
      if (checked === undefined) return
      setSelfChecked(Boolean(checked))
    }, [checked])

    const radioStyle = {
      width: SCALES.width(1, 'initial'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--radio-own-size': SCALES.font(1),
      '--radio-focus-color': theme.palette.primary,
      '--radio-label-color': isDisabled ? theme.palette.accents_4 : label,
      '--radio-cursor': isDisabled ? 'not-allowed' : 'pointer',
      '--radio-border': border,
      '--radio-point-bg': isDisabled ? theme.palette.accents_4 : bg
    } as React.CSSProperties

    return (
      <div
        className={useClasses('radio', styles.radio, className)}
        style={radioStyle}
      >
        <label className={styles.label}>
          <input
            ref={ref}
            type="radio"
            value={radioValue}
            checked={selfChecked}
            onChange={changeHandler}
            {...props}
            className={styles.input}
          />
          <span className={styles.name}>
            <span
              className={useClasses(styles.point, {
                [styles.active]: selfChecked
              })}
            />
            {withoutDescChildren}
          </span>
          {DescChildren && DescChildren}
        </label>
      </div>
    )
  }
)

RadioComponent.displayName = 'BolioUIRadio'
const Radio = withScale(RadioComponent)
export default Radio
