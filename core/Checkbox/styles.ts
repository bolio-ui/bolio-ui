import { BolioUIThemesPalette } from '../Themes/Presets'
import { NormalTypes } from '../utils/prop-types'

export type CheckboxColor = {
  fill: string
  bg: string
}

export const getColors = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes
): CheckboxColor => {
  const colors: { [key in NormalTypes]: CheckboxColor } = {
    default: {
      fill: palette.foreground,
      bg: palette.background
    },
    primary: {
      fill: palette.primary,
      bg: palette.background
    },
    secondary: {
      fill: palette.secondary,
      bg: palette.background
    },
    success: {
      fill: palette.success,
      bg: palette.background
    },
    warning: {
      fill: palette.warning,
      bg: palette.background
    },
    error: {
      fill: palette.error,
      bg: palette.background
    },
    info: {
      fill: palette.info,
      bg: palette.background
    }
  }

  if (!status) return colors.default
  return colors[status]
}
