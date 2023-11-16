import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'

export type InputColor = {
  color: string
  bgColor: string
  borderColor: string
  hoverBgColor: string
  hoverBorder: string
}

export const getColors = (
  palette: BolioUIThemesPalette,
  status?: NormalTypes,
  disabled?: boolean,
  readOnly?: boolean
): InputColor => {
  const colors: { [key in NormalTypes]: InputColor } = {
    default: {
      color: palette.foreground,
      bgColor: palette.accents_2,
      borderColor: palette.accents_3,
      hoverBgColor: palette.accents_2,
      hoverBorder: palette.accents_5
    },
    primary: {
      color: palette.primaryDark,
      bgColor: palette.primaryLight,
      borderColor: palette.primary,
      hoverBgColor: palette.primaryLight,
      hoverBorder: palette.primary
    },
    secondary: {
      color: palette.secondaryDark,
      bgColor: palette.secondaryLight,
      borderColor: palette.secondary,
      hoverBgColor: palette.secondaryLight,
      hoverBorder: palette.secondary
    },
    success: {
      color: palette.successDark,
      bgColor: palette.successLight,
      borderColor: palette.success,
      hoverBgColor: palette.successLight,
      hoverBorder: palette.success
    },
    warning: {
      color: palette.warningDark,
      bgColor: palette.warningLight,
      borderColor: palette.warning,
      hoverBgColor: palette.warningLight,
      hoverBorder: palette.warning
    },
    error: {
      color: palette.errorDark,
      bgColor: palette.errorLight,
      borderColor: palette.error,
      hoverBgColor: palette.errorLight,
      hoverBorder: palette.error
    },
    info: {
      color: palette.infoDark,
      bgColor: palette.infoLight,
      borderColor: palette.info,
      hoverBgColor: palette.infoLight,
      hoverBorder: palette.info
    }
  }

  if (disabled)
    return {
      color: palette.accents_5,
      bgColor: palette.accents_3,
      borderColor: palette.accents_4,
      hoverBgColor: palette.accents_3,
      hoverBorder: palette.accents_4
    }

  if (readOnly)
    return {
      color: palette.foreground,
      bgColor: palette.accents_2,
      borderColor: palette.accents_3,
      hoverBgColor: palette.accents_2,
      hoverBorder: palette.accents_5
    }

  if (!status) return colors.default
  return colors[status]
}
