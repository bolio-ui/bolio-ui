import { SnippetTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'

export type TooltipColors = {
  bgColor: string
  color: string
}

export const getColors = (
  type: SnippetTypes,
  palette: BolioUIThemesPalette
): TooltipColors => {
  const colors: { [key in SnippetTypes]: string } = {
    default: palette.background,
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    dark: palette.foreground,
    lite: palette.background
  }
  const color =
    type === 'lite' || type === 'default'
      ? palette.foreground
      : palette.background

  return {
    color,
    bgColor: colors[type]
  }
}
