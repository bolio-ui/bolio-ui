import { BolioUIThemesPalette } from '../themes/presets'
import { NormalTypes } from '../utils/prop-types'

type ButtonDropdownColors = {
  color: string
  bgColor: string
  hoverBgColor: string
  hoverBorder: string
  borderLeftColor: string
}

export const getColor = (
  palette: BolioUIThemesPalette,
  type: NormalTypes | undefined,
  disabled = false
) => {
  const colors: { [key in NormalTypes]: ButtonDropdownColors } = {
    default: {
      color: palette.accents_5,
      bgColor: palette.background,
      borderLeftColor: palette.accents_2,
      hoverBgColor: palette.accents_1,
      hoverBorder: palette.accents_2
    },
    primary: {
      color: palette.background,
      bgColor: palette.primary,
      borderLeftColor: palette.primaryDark,
      hoverBgColor: palette.primaryDark,
      hoverBorder: palette.primaryDark
    },
    secondary: {
      color: palette.background,
      bgColor: palette.secondary,
      borderLeftColor: palette.secondaryDark,
      hoverBgColor: palette.secondaryDark,
      hoverBorder: palette.secondaryDark
    },
    success: {
      color: palette.background,
      bgColor: palette.success,
      borderLeftColor: palette.successDark,
      hoverBgColor: palette.successDark,
      hoverBorder: palette.successDark
    },
    warning: {
      color: palette.background,
      bgColor: palette.warning,
      borderLeftColor: palette.warningDark,
      hoverBgColor: palette.warningDark,
      hoverBorder: palette.warningDark
    },
    error: {
      color: palette.background,
      bgColor: palette.error,
      borderLeftColor: palette.errorDark,
      hoverBgColor: palette.errorDark,
      hoverBorder: palette.errorDark
    },
    info: {
      color: palette.background,
      bgColor: palette.info,
      borderLeftColor: palette.infoDark,
      hoverBgColor: palette.infoDark,
      hoverBorder: palette.infoDark
    }
  }

  if (disabled)
    return {
      ...colors.default,
      bgColor: palette.accents_1,
      color: palette.accents_4
    }
  return type ? colors[type] : colors.default
}
