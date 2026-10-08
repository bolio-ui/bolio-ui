import React, { useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getVariantColors } from '../utils/variant-colors'
import type { SemanticColorType } from '../utils/variant-colors'
import { useChipContext } from './ChipContext'
import styles from './Chip.module.css'

interface Props {
  // inside a Chip.Group, the value it adds to or takes from the group
  value?: string
  checked?: boolean
  initialChecked?: boolean
  onChange?: (checked: boolean) => void
  // color of a checked chip
  type?: SemanticColorType
  disabled?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'type' | 'name' | 'defaultChecked' | 'onChange'
>
export type ChipProps = Props & NativeAttrs

const ChipComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<ChipProps>
>(
  (
    {
      value,
      checked: customChecked,
      initialChecked = false,
      onChange,
      type = 'primary' as SemanticColorType,
      disabled = false,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const group = useChipContext()
    const [selfChecked, setSelfChecked] = useState(initialChecked)

    const checked = group
      ? group.value.includes(value as string)
      : customChecked !== undefined
        ? customChecked
        : selfChecked

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (group) {
        if (group.toggle) group.toggle(value as string)
        return
      }
      setSelfChecked(event.target.checked)
      if (onChange) onChange(event.target.checked)
    }

    const { bg, color, border } = getVariantColors(theme.palette, type, 'light')
    const chipStyle = {
      height: SCALES.height(2),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      fontSize: SCALES.font(0.875),
      '--chip-color': theme.palette.accents_6,
      '--chip-border': theme.palette.accents_3,
      '--chip-hover-bg': theme.palette.accents_1,
      '--chip-checked-bg': bg,
      '--chip-checked-color': color,
      '--chip-checked-border': border,
      '--chip-focus': theme.palette[type],
      ...style
    } as React.CSSProperties

    return (
      <label className={useClasses(styles.chip, className)} style={chipStyle}>
        <input
          ref={ref}
          type={group && !group.multiple ? 'radio' : 'checkbox'}
          className={styles.input}
          name={group?.name}
          value={value}
          checked={checked}
          disabled={disabled || group?.disabled}
          onChange={changeHandler}
          {...props}
        />
        <span className={styles.text}>
          {checked && (
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 5 5L20 7" />
            </svg>
          )}
          {children}
        </span>
      </label>
    )
  }
)

ChipComponent.displayName = 'BolioUIChip'
const Chip = withScale(ChipComponent)
export default Chip
