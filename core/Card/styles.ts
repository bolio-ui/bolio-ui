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
      bgColor: palette.primaryLighter,
      borderColor: palette.primaryDark
    },
    secondary: {
      color: palette.secondaryDark,
      bgColor: palette.secondaryLighter,
      borderColor: palette.secondaryDark
    },
    success: {
      color: palette.successDark,
      bgColor: palette.successLighter,
      borderColor: palette.successDark
    },
    warning: {
      color: palette.warningDark,
      bgColor: palette.warningLighter,
      borderColor: palette.warningDark
    },
    error: {
      color: palette.errorDark,
      bgColor: palette.errorLighter,
      borderColor: palette.errorDark
    },
    info: {
      color: palette.infoDark,
      bgColor: palette.infoLighter,
      borderColor: palette.infoDark
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
    ...colors[type],
    borderColor: showBorder ? palette.border : 'transparent'
  }
}
