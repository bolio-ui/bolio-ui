import { BolioUIThemesPalette } from '../Themes/Presets'
import { NormalTypes } from '../utils/prop-types'

export type SelectColor = {
  bg: string
}

export const getColors = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes
): SelectColor => {
  const colors: { [key in NormalTypes]: SelectColor } = {
    default: {
      bg: palette.accents_8
    },
    primary: {
      bg: palette.primary
    },
    secondary: {
      bg: palette.secondary
    },
    success: {
      bg: palette.success
    },
    warning: {
      bg: palette.warning
    },
    error: {
      bg: palette.error
    },
    info: {
      bg: palette.info
    }
  }

  if (!status) return colors.default
  return colors[status]
}
