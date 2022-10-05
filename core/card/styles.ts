import { CardTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../themes/presets'

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
  const colors: { [key in CardTypes]: Omit<CardStyles, 'borderColor'> } = {
    default: {
      color: palette.foreground,
      bgColor: palette.accents_1
    },
    dark: {
      color: palette.background,
      bgColor: palette.foreground
    },
    primary: {
      color: palette.background,
      bgColor: palette.primary
    },
    secondary: {
      color: palette.background,
      bgColor: palette.secondary
    },
    success: {
      color: palette.background,
      bgColor: palette.success
    },
    warning: {
      color: palette.background,
      bgColor: palette.warning
    },
    error: {
      color: palette.background,
      bgColor: palette.error
    },
    lite: {
      color: palette.foreground,
      bgColor: palette.background
    },
    info: {
      color: palette.background,
      bgColor: palette.info
    }
  }
  const showBorder = type === 'default' && !isShadow
  return {
    ...colors[type],
    borderColor: showBorder ? palette.border : 'transparent'
  }
}
