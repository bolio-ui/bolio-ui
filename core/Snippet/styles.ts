import { SnippetTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'

export type SnippetStyles = {
  color: string
  border: string
  bgColor: string
}

export interface SnippetVariantProps {
  fill?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
}

export const getStyles = (
  type: SnippetTypes,
  palette: BolioUIThemesPalette,
  { fill, light, ghost, subtle }: SnippetVariantProps = {}
): SnippetStyles => {
  if (isSemanticColorType(type)) {
    if (subtle) {
      const { bg, border, color } = getVariantColors(palette, type, 'subtle')
      return { color, border, bgColor: bg }
    }
    if (light) {
      const { bg, border, color } = getVariantColors(palette, type, 'light')
      return { color, border, bgColor: bg }
    }
    if (ghost) {
      const { bg, border, color } = getVariantColors(palette, type, 'outline')
      return { color, border, bgColor: bg }
    }
  }

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
