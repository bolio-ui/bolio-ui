import React from 'react'
import { Select } from 'core'

export const mix = (hex: string, target: number, ratio: number) => {
  const n = parseInt(hex.slice(1), 16)
  return (
    '#' +
    [n >> 16, (n >> 8) & 255, n & 255]
      .map((c) =>
        Math.round(c + (target - c) * ratio)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

export // "default" keeps the preset neutrals; the others tint them with that color.
const BASES: Record<string, string> = {
  default: '',
  slate: '#64748b',
  zinc: '#71717a',
  warm: '#a8a29e',
  rose: '#be7b8a',
  ocean: '#5b8fb9'
}

export const FONTS: Record<string, string> = {
  inter: '',
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'Menlo, Monaco, "Courier New", monospace'
}

export const RADII: Record<string, number> = {
  none: 0,
  small: 6,
  medium: 10,
  large: 16,
  full: 24
}

export const neutralsFor = (tint: string, dark: boolean) =>
  !tint
    ? {}
    : dark
      ? {
          background: mix(tint, 0, 0.94),
          accents_1: mix(tint, 0, 0.9),
          accents_2: mix(tint, 0, 0.86),
          accents_3: mix(tint, 0, 0.8),
          accents_4: mix(tint, 0, 0.72),
          border: mix(tint, 0, 0.86)
        }
      : {
          accents_1: mix(tint, 255, 0.96),
          accents_2: mix(tint, 255, 0.92),
          border: mix(tint, 255, 0.9)
        }

export const OptionSelect: React.FC<{
  value: string
  options: Array<string>
  onChange: (value: string) => void
}> = ({ value, options, onChange }) => (
  <Select
    value={value}
    onChange={(next) => onChange(next as string)}
    width="140px"
  >
    {options.map((option) => (
      <Select.Option key={option} value={option}>
        {option[0].toUpperCase() + option.slice(1)}
      </Select.Option>
    ))}
  </Select>
)
