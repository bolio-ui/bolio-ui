import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { RadioContext } from './RadioContext'
import InputBlockLabel from '../Input/InputBlockLabel'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './RadioGroup.module.css'

interface Props {
  value?: string | number
  initialValue?: string | number
  disabled?: boolean
  onChange?: (value: string | number) => void
  className?: string
  useRow?: boolean
  error?: boolean
  errorMessage?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type RadioGroupProps = Props & NativeAttrs

function RadioGroupComponent({
  disabled = false,
  onChange,
  value,
  children,
  className = '',
  initialValue,
  useRow = false,
  error = false,
  errorMessage,
  style,
  ...props
}: React.PropsWithChildren<RadioGroupProps>) {
  const { SCALES } = useScale()
  const errorId = `${useId()}-error`

  const [selfVal, setSelfVal] = useState<string | number | undefined>(
    initialValue
  )

  const updateState = useCallback(
    (nextValue: string | number) => {
      setSelfVal(nextValue)
      if (onChange) onChange(nextValue)
    },
    [onChange]
  )

  const providerValue = useMemo(() => {
    return {
      updateState,
      disabledAll: disabled,
      inGroup: true,
      value: selfVal
    }
  }, [updateState, disabled, selfVal])

  useEffect(() => {
    if (value === undefined) return
    setSelfVal(value)
  }, [value])

  const groupStyle = {
    flexDirection: useRow ? 'row' : 'column',
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--radio-group-item-size': SCALES.font(1),
    '--radio-group-margin-top': useRow ? 0 : SCALES.font(1),
    '--radio-group-margin-left': useRow ? SCALES.font(1) : 0,
    ...style
  } as React.CSSProperties

  return (
    <RadioContext.Provider value={providerValue}>
      <div
        className={useClasses(styles.radioGroup, className)}
        aria-invalid={error || undefined}
        aria-describedby={error && errorMessage ? errorId : undefined}
        {...props}
        style={groupStyle}
      >
        {children}
      </div>
      {error && (
        <InputBlockLabel error={error} id={errorId}>
          {errorMessage}
        </InputBlockLabel>
      )}
    </RadioContext.Provider>
  )
}

RadioGroupComponent.displayName = 'BolioUIRadioGroup'
const RadioGroup = withScale(RadioGroupComponent)
export default RadioGroup
