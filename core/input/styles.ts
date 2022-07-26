import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../themes/presets'

export type InputColor = {
  color: string
  borderColor: string
  hoverBorder: string
}

export const getColors = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes
): InputColor => {
  const colors: { [key in NormalTypes]: InputColor } = {
    default: {
      color: palette.foreground,
      borderColor: palette.border,
      hoverBorder: palette.accents_5
    },
    primary: {
      color: palette.primary,
      borderColor: palette.primary,
      hoverBorder: palette.primary
    },
    secondary: {
      color: palette.secondary,
      borderColor: palette.secondary,
      hoverBorder: palette.secondary
    },
    success: {
      color: palette.success,
      borderColor: palette.success,
      hoverBorder: palette.success
    },
    warning: {
      color: palette.warning,
      borderColor: palette.warning,
      hoverBorder: palette.warning
    },
    error: {
      color: palette.error,
      borderColor: palette.error,
      hoverBorder: palette.error
    },
    info: {
      color: palette.info,
      borderColor: palette.info,
      hoverBorder: palette.info
    }
  }

  if (!status) return colors.default
  return colors[status]
}
