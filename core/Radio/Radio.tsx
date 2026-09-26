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

type NativeAttrs = Omit<React.InputHTMLAttributes<any>, keyof Props>
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

    return (
      <div className={useClasses('radio', className)}>
        <label>
          <input
            ref={ref}
            type="radio"
            value={radioValue}
            checked={selfChecked}
            onChange={changeHandler}
            {...props}
          />
          <span className="name">
            <span className={useClasses('point', { active: selfChecked })} />
            {withoutDescChildren}
          </span>
          {DescChildren && DescChildren}
        </label>
        <style jsx>{`
          input {
            opacity: 0;
            overflow: hidden;
            width: 1px;
            height: 1px;
            margin: 0;
            top: 0;
            left: 0;
            position: absolute;
            font-size: 0;
          }
          input:focus-visible + .name {
            border-radius: 4px;
            outline: 2px solid ${theme.palette.primary};
            outline-offset: 2px;
          }
          .radio {
            display: flex;
            align-items: flex-start;
            position: relative;
            --radio-size: ${SCALES.font(1)};
            width: ${SCALES.width(1, 'initial')};
            height: ${SCALES.height(1, 'auto')};
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
              ${SCALES.pl(0)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }
          label {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            color: ${isDisabled ? theme.palette.accents_4 : label};
            cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
          }
          .name {
            font-size: var(--radio-size);
            font-weight: bold;
            user-select: none;
            display: inline-flex;
            align-items: center;
          }
          .point {
            height: var(--radio-size);
            width: var(--radio-size);
            border-radius: 50%;
            border: 1px solid ${border};
            transition: all 0.2s ease 0s;
            position: relative;
            display: inline-block;
            transform: scale(0.875);
            margin-right: calc(var(--radio-size) * 0.375);
          }
          .point:before {
            content: '';
            position: absolute;
            left: -1px;
            top: -1px;
            transform: scale(0);
            height: var(--radio-size);
            width: var(--radio-size);
            border-radius: 50%;
            background-color: ${isDisabled ? theme.palette.accents_4 : bg};
          }
          .active:before {
            transform: scale(0.875);
            transition: all 0.2s ease 0s;
          }
        `}</style>
      </div>
    )
  }
)

RadioComponent.displayName = 'BolioUIRadio'
const Radio = withScale(RadioComponent)
export default Radio
