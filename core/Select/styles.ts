import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'

export type SelectColor = {
  color: string
  bgColor: string
  borderColor: string
  hoverBgColor: string
  hoverBorder: string
}

export const getColors = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes
): SelectColor => {
  const colors: { [key in NormalTypes]: SelectColor } = {
    default: {
      color: palette.foreground,
      bgColor: palette.accents_2,
      borderColor: palette.accents_3,
      hoverBgColor: palette.accents_2,
      hoverBorder: palette.accents_6
    },
    primary: {
      color: palette.primaryDark,
      bgColor: palette.primaryLighter,
      borderColor: palette.primaryDark,
      hoverBgColor: palette.primaryLight,
      hoverBorder: palette.primary
    },
    secondary: {
      color: palette.secondaryDark,
      bgColor: palette.secondaryLighter,
      borderColor: palette.secondaryDark,
      hoverBgColor: palette.secondaryLight,
      hoverBorder: palette.secondary
    },
    success: {
      color: palette.successDark,
      bgColor: palette.successLighter,
      borderColor: palette.successDark,
      hoverBgColor: palette.successLight,
      hoverBorder: palette.success
    },
    warning: {
      color: palette.warningDark,
      bgColor: palette.warningLighter,
      borderColor: palette.warningDark,
      hoverBgColor: palette.warningLight,
      hoverBorder: palette.warning
    },
    error: {
      color: palette.errorDark,
      bgColor: palette.errorLighter,
      borderColor: palette.errorDark,
      hoverBgColor: palette.errorLight,
      hoverBorder: palette.error
    },
    info: {
      color: palette.infoDark,
      bgColor: palette.infoLighter,
      borderColor: palette.infoDark,
      hoverBgColor: palette.infoLight,
      hoverBorder: palette.info
    }
  }

  if (!status) return colors.default
  return colors[status]
}
