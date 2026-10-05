import { BolioUIThemesPalette } from '../Themes/Presets'
import { NormalTypes } from '../utils/prop-types'

export const getColor = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes
): string => {
  const colors: { [key in NormalTypes]: string } = {
    default: palette.accents_8,
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info
  }

  if (!status) return colors.default
  return colors[status]
}
