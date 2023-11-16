import { BolioUIThemesPalette } from '../Themes/Presets'
import { NormalTypes } from '../utils/prop-types'

type ButtonDropdownColors = {
  color: string
  bgColor: string
  borderColor: string
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
      color: palette.foreground,
      bgColor: palette.accents_2,
      borderColor: palette.accents_3,
      borderLeftColor: palette.accents_3,
      hoverBgColor: palette.accents_3,
      hoverBorder: palette.accents_7
    },
    primary: {
      color: palette.primaryDark,
      bgColor: palette.primaryLight,
      borderColor: palette.primary,
      borderLeftColor: palette.primary,
      hoverBgColor: palette.primaryLight,
      hoverBorder: palette.primary
    },
    secondary: {
      color: palette.secondaryDark,
      bgColor: palette.secondaryLight,
      borderColor: palette.secondary,
      borderLeftColor: palette.secondary,
      hoverBgColor: palette.secondaryLight,
      hoverBorder: palette.secondary
    },
    success: {
      color: palette.successDark,
      bgColor: palette.successLight,
      borderColor: palette.success,
      borderLeftColor: palette.success,
      hoverBgColor: palette.successLight,
      hoverBorder: palette.success
    },
    warning: {
      color: palette.warningDark,
      bgColor: palette.warningLight,
      borderColor: palette.warning,
      borderLeftColor: palette.warning,
      hoverBgColor: palette.warningLight,
      hoverBorder: palette.warning
    },
    error: {
      color: palette.errorDark,
      bgColor: palette.errorLight,
      borderColor: palette.error,
      borderLeftColor: palette.error,
      hoverBgColor: palette.errorLight,
      hoverBorder: palette.error
    },
    info: {
      color: palette.infoDark,
      bgColor: palette.infoLight,
      borderColor: palette.info,
      borderLeftColor: palette.info,
      hoverBgColor: palette.infoLight,
      hoverBorder: palette.info
    }
  }

  if (disabled)
    return {
      ...colors.default,
      color: palette.accents_5,
      bgColor: palette.accents_3,
      borderColor: palette.accents_4,
      borderLeftColor: palette.accents_4,
      hoverBgColor: palette.accents_3,
      hoverBorder: palette.accents_4
    }

  return type ? colors[type] : colors.default
}
