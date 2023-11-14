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
      color: palette.primaryLighter,
      bgColor: palette.primaryDark,
      borderColor: palette.primaryLighter
    },
    secondary: {
      color: palette.secondaryLighter,
      bgColor: palette.secondaryDark,
      borderColor: palette.secondaryLighter
    },
    success: {
      color: palette.successLighter,
      bgColor: palette.successDark,
      borderColor: palette.successLighter
    },
    warning: {
      color: palette.warningLighter,
      bgColor: palette.warningDark,
      borderColor: palette.warningLighter
    },
    error: {
      color: palette.errorLighter,
      bgColor: palette.errorDark,
      borderColor: palette.errorLighter
    },
    info: {
      color: palette.infoLighter,
      bgColor: palette.infoDark,
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
