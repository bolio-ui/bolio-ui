import React from 'react'
import { NormalTypes } from '../utils/prop-types'

export type InputTypes = NormalTypes

export type CrossOrigin = 'anonymous' | 'use-credentials' | '' | undefined

export interface Props {
  value?: string
  initialValue?: string
  placeholder?: string
  type?: InputTypes
  htmlType?: string
  readOnly?: boolean
  disabled?: boolean
  label?: string
  labelRight?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  iconClickable?: boolean
  className?: string
  clearable?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onIconClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  autoComplete?: string
  backgroundColor?: string
  borderColor?: string
  hoverBorder?: string
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  error?: boolean
  errorMessage?: string
  floating?: boolean
  crossOrigin?: CrossOrigin
}

export const defaultProps = {
  disabled: false,
  readOnly: false,
  clearable: false,
  filled: false,
  light: false,
  ghost: false,
  subtle: false,
  iconClickable: false,
  type: 'default' as InputTypes,
  htmlType: 'text',
  autoComplete: 'off',
  className: '',
  placeholder: '',
  initialValue: ''
}
