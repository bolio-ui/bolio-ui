import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'

export type SelectColor = {
  border: string
  borderActive: string
  iconBorder: string
  placeholderColor: string
}

export const getColors = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes
): SelectColor => {
  const colors: { [key in NormalTypes]: SelectColor } = {
    default: {
      border: palette.border,
      borderActive: palette.foreground,
      iconBorder: palette.accents_5,
      placeholderColor: palette.accents_3
    },
    primary: {
      border: palette.primary,
      borderActive: palette.primary,
      iconBorder: palette.primary,
      placeholderColor: palette.accents_3
    },
    secondary: {
      border: palette.secondary,
      borderActive: palette.secondary,
      iconBorder: palette.secondary,
      placeholderColor: palette.accents_3
    },
    success: {
      border: palette.success,
      borderActive: palette.success,
      iconBorder: palette.success,
      placeholderColor: palette.accents_3
    },
    warning: {
      border: palette.warning,
      borderActive: palette.warning,
      iconBorder: palette.warning,
      placeholderColor: palette.accents_3
    },
    error: {
      border: palette.error,
      borderActive: palette.error,
      iconBorder: palette.error,
      placeholderColor: palette.error
    },
    info: {
      border: palette.info,
      borderActive: palette.info,
      iconBorder: palette.info,
      placeholderColor: palette.accents_3
    }
  }

  if (!status) return colors.default
  return colors[status]
}
