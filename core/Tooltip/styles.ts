import { SnippetTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'

export type TooltipColors = {
  bgColor: string
  color: string
  borderColor: string
}

export interface TooltipVariantProps {
  light?: boolean
  ghost?: boolean
  subtle?: boolean
}

export const getColors = (
  type: SnippetTypes,
  palette: BolioUIThemesPalette,
  { light, ghost, subtle }: TooltipVariantProps = {}
): TooltipColors => {
  if (isSemanticColorType(type)) {
    const variant = subtle
      ? 'subtle'
      : light
      ? 'light'
      : ghost
      ? 'outline'
      : 'filled'
    const { bg, border, color } = getVariantColors(palette, type, variant)
    return { color, bgColor: bg, borderColor: border }
  }

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
    bgColor: colors[type],
    borderColor: colors[type]
  }
}
