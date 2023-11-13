import { CardTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'

export type CardStyles = {
  color: string
  bgColor: string
  borderColor: string
}

export const getStyles = (
  type: CardTypes,
  palette: BolioUIThemesPalette,
  isShadow?: boolean
): CardStyles => {
  const colors: { [key in CardTypes]: CardStyles } = {
    default: {
      color: palette.foreground,
      bgColor: palette.accents_1,
      borderColor: palette.accents_2
    },
    primary: {
      color: palette.primaryDark,
      bgColor: palette.primaryLight,
      borderColor: palette.primaryLighter
    },
    secondary: {
      color: palette.secondaryDark,
      bgColor: palette.secondaryLight,
      borderColor: palette.secondaryLighter
    },
    success: {
      color: palette.successDark,
      bgColor: palette.successLight,
      borderColor: palette.successLighter
    },
    warning: {
      color: palette.warningDark,
      bgColor: palette.warningLight,
      borderColor: palette.warningLighter
    },
    error: {
      color: palette.errorDark,
      bgColor: palette.errorLight,
      borderColor: palette.errorLighter
    },
    info: {
      color: palette.infoDark,
      bgColor: palette.infoLight,
      borderColor: palette.infoLighter
    },
    dark: {
      color: palette.background,
      bgColor: palette.foreground,
      borderColor: palette.foreground
    },
    lite: {
      color: palette.foreground,
      bgColor: palette.background,
      borderColor: palette.foreground
    }
  }
  const showBorder = type === 'default' && !isShadow
  return {
    ...colors[type]
    // borderColor: showBorder ? palette.border : 'transparent'
  }
}
