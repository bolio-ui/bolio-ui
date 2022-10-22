import { SnippetTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../themes/presets'

export type SnippetStyles = {
  color: string
  border: string
  bgColor: string
}

export const getStyles = (
  type: SnippetTypes,
  palette: BolioUIThemesPalette,
  fill?: boolean
) => {
  const styles: { [key in SnippetTypes]: SnippetStyles } = {
    default: {
      color: palette.foreground,
      border: palette.accents_2,
      bgColor: palette.accents_2
    },
    primary: {
      color: palette.primary,
      border: palette.primary,
      bgColor: palette.accents_1
    },
    secondary: {
      color: palette.secondary,
      border: palette.secondary,
      bgColor: palette.accents_1
    },
    success: {
      color: palette.success,
      border: palette.success,
      bgColor: palette.accents_1
    },
    warning: {
      color: palette.warning,
      border: palette.warning,
      bgColor: palette.accents_1
    },
    error: {
      color: palette.error,
      border: palette.error,
      bgColor: palette.accents_1
    },
    info: {
      color: palette.info,
      border: palette.info,
      bgColor: palette.accents_1
    },
    lite: {
      color: palette.foreground,
      border: palette.border,
      bgColor: palette.accents_1
    },
    dark: {
      color: palette.background,
      border: palette.foreground,
      bgColor: palette.foreground
    }
  }

  const filledTypes: Array<SnippetTypes> = [
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info'
  ]
  const style = styles[type]
  const shouldFilled = filledTypes.includes(type)
  if (!fill || !shouldFilled) return style

  return {
    ...style,
    color: style.bgColor,
    bgColor: style.color
  }
}
