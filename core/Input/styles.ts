import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'

// Single source of colors for every field (Input, Textarea, NumberInput,
// Select, Combobox, DatePicker).
export type InputColor = {
  color: string
  bgColor: string
  borderColor: string
  hoverBgColor: string
  hoverBorder: string
  focusBorder: string
  placeholderColor: string
  iconColor: string
}

export interface InputVariantProps {
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
}

export const getColors = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes,
  disabled?: boolean,
  { filled, light, ghost, subtle }: InputVariantProps = {}
): InputColor => {
  if (disabled)
    return {
      color: palette.accents_4,
      bgColor: palette.accents_1,
      borderColor: palette.border,
      hoverBgColor: palette.accents_1,
      hoverBorder: palette.border,
      focusBorder: palette.border,
      placeholderColor: palette.accents_4,
      iconColor: palette.accents_3
    }

  if (!status || !isSemanticColorType(status))
    return {
      color: palette.foreground,
      bgColor: palette.background,
      borderColor: palette.border,
      hoverBgColor: palette.background,
      hoverBorder: palette.accents_4,
      focusBorder: palette.primary,
      placeholderColor: palette.accents_6,
      iconColor: palette.accents_5
    }

  const base = palette[status]
  const dark = palette[`${status}Dark`]

  if (subtle) {
    const { bg, color } = getVariantColors(palette, status, 'subtle')
    return {
      color,
      bgColor: bg,
      borderColor: palette[`${status}Light`],
      hoverBgColor: palette[`${status}Light`],
      hoverBorder: base,
      focusBorder: dark,
      placeholderColor: color,
      iconColor: color
    }
  }
  if (light) {
    const { bg, border, color } = getVariantColors(palette, status, 'light')
    return {
      color,
      bgColor: bg,
      borderColor: border,
      hoverBgColor: bg,
      hoverBorder: base,
      focusBorder: dark,
      placeholderColor: color,
      iconColor: color
    }
  }
  if (ghost) {
    const { bg, border, color } = getVariantColors(palette, status, 'outline')
    return {
      color,
      bgColor: bg,
      borderColor: border,
      hoverBgColor: bg,
      hoverBorder: dark,
      focusBorder: dark,
      placeholderColor: palette[`${status}Light`],
      iconColor: color
    }
  }
  if (filled) {
    const { bg, border, color } = getVariantColors(palette, status, 'filled')
    return {
      color,
      bgColor: bg,
      borderColor: border,
      hoverBgColor: bg,
      hoverBorder: dark,
      focusBorder: dark,
      placeholderColor: 'rgba(255, 255, 255, 0.7)',
      iconColor: color
    }
  }

  return {
    color: dark,
    bgColor: palette[`${status}Light`],
    borderColor: base,
    hoverBgColor: palette[`${status}Light`],
    hoverBorder: base,
    focusBorder: dark,
    placeholderColor: palette.accents_6,
    iconColor: dark
  }
}
