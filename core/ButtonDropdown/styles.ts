import { BolioUIThemesPalette } from '../Themes/Presets'
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
      color: palette.foreground,
      bgColor: palette.accents_2,
      borderLeftColor: palette.accents_2,
      hoverBgColor: palette.accents_2,
      hoverBorder: palette.accents_2
    },
    primary: {
      color: palette.primaryDark,
      bgColor: palette.primaryLight,
      borderLeftColor: palette.primaryLighter,
      hoverBgColor: palette.primaryLighter,
      hoverBorder: palette.primaryLighter
    },
    secondary: {
      color: palette.secondaryDark,
      bgColor: palette.secondaryLight,
      borderLeftColor: palette.secondaryLighter,
      hoverBgColor: palette.secondaryLighter,
      hoverBorder: palette.secondaryLighter
    },
    success: {
      color: palette.successDark,
      bgColor: palette.successLight,
      borderLeftColor: palette.successLighter,
      hoverBgColor: palette.successLighter,
      hoverBorder: palette.successLighter
    },
    warning: {
      color: palette.warningDark,
      bgColor: palette.warningLight,
      borderLeftColor: palette.warningLighter,
      hoverBgColor: palette.warningLighter,
      hoverBorder: palette.warningLighter
    },
    error: {
      color: palette.errorDark,
      bgColor: palette.errorLight,
      borderLeftColor: palette.errorLighter,
      hoverBgColor: palette.errorLighter,
      hoverBorder: palette.errorLighter
    },
    info: {
      color: palette.infoDark,
      bgColor: palette.infoLight,
      borderLeftColor: palette.infoLighter,
      hoverBgColor: palette.infoLighter,
      hoverBorder: palette.infoLighter
    }
  }

  if (disabled)
    return {
      ...colors.default,
      bgColor: palette.accents_3,
      color: palette.accents_5
    }
  return type ? colors[type] : colors.default
}
