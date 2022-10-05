import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../themes/presets'

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
      border: palette.primaryLight,
      borderActive: palette.primaryDark,
      iconBorder: palette.primary,
      placeholderColor: palette.accents_3
    },
    secondary: {
      border: palette.secondaryLight,
      borderActive: palette.secondaryDark,
      iconBorder: palette.secondary,
      placeholderColor: palette.accents_3
    },
    success: {
      border: palette.successLight,
      borderActive: palette.successDark,
      iconBorder: palette.success,
      placeholderColor: palette.accents_3
    },
    warning: {
      border: palette.warningLight,
      borderActive: palette.warningDark,
      iconBorder: palette.warning,
      placeholderColor: palette.accents_3
    },
    error: {
      border: palette.errorLight,
      borderActive: palette.errorDark,
      iconBorder: palette.error,
      placeholderColor: palette.error
    },
    info: {
      border: palette.infoLight,
      borderActive: palette.infoDark,
      iconBorder: palette.info,
      placeholderColor: palette.accents_3
    }
  }

  if (!status) return colors.default
  return colors[status]
}
