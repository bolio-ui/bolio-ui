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
      borderColor: palette.accents_2,
      borderLeftColor: palette.accents_2,
      hoverBgColor: palette.accents_2,
      hoverBorder: palette.accents_2
    },
    primary: {
      color: palette.primaryDark,
      bgColor: palette.primaryLighter,
      borderColor: palette.primaryDark,
      borderLeftColor: palette.primaryDark,
      hoverBgColor: palette.primaryLight,
      hoverBorder: palette.primary
    },
    secondary: {
      color: palette.secondaryDark,
      bgColor: palette.secondaryLighter,
      borderColor: palette.secondaryDark,
      borderLeftColor: palette.secondaryDark,
      hoverBgColor: palette.secondaryLight,
      hoverBorder: palette.secondary
    },
    success: {
      color: palette.successDark,
      bgColor: palette.successLighter,
      borderColor: palette.successDark,
      borderLeftColor: palette.successDark,
      hoverBgColor: palette.successLight,
      hoverBorder: palette.success
    },
    warning: {
      color: palette.warningDark,
      bgColor: palette.warningLighter,
      borderColor: palette.warningDark,
      borderLeftColor: palette.warningDark,
      hoverBgColor: palette.warningLight,
      hoverBorder: palette.warning
    },
    error: {
      color: palette.errorDark,
      bgColor: palette.errorLighter,
      borderColor: palette.errorDark,
      borderLeftColor: palette.errorDark,
      hoverBgColor: palette.errorLight,
      hoverBorder: palette.error
    },
    info: {
      color: palette.infoDark,
      bgColor: palette.infoLighter,
      borderColor: palette.infoDark,
      borderLeftColor: palette.infoDark,
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
      hoverBorder: palette.accents_3
    }
  return type ? colors[type] : colors.default
}
