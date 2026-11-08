import type { BolioUIThemesPalette } from '../Themes/Presets'
import { colorToRgbValues } from './color'

// The 4 variants shared across colored surfaces (Button, Tag, Badge, Note,
// Snippet, Card, Tooltip): a solid fill, a tinted background, a bordered
// outline on the page background, and text-only with no background at all.
export type SurfaceVariant = 'filled' | 'light' | 'outline' | 'subtle'

export const SEMANTIC_COLOR_TYPES = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info'
] as const

export type SemanticColorType = (typeof SEMANTIC_COLOR_TYPES)[number]

export const isSemanticColorType = (type?: string): type is SemanticColorType =>
  !!type && (SEMANTIC_COLOR_TYPES as ReadonlyArray<string>).includes(type)

// Palettes carry no theme type, so a dark one is the one whose page is darker
// than its text.
export const isDarkPalette = (palette: BolioUIThemesPalette) =>
  palette.background < palette.foreground

// The pastel `Light`/`Lighter` tokens glare on a dark page, so there the tint
// is the type's own color mixed into the page background. Computed as plain
// rgb (not `color-mix`) because callers like Button feed it to addColorAlpha.
export const mixWithPage = (
  palette: BolioUIThemesPalette,
  color: string,
  percent: number
) => {
  const from = colorToRgbValues(color)
  const to = colorToRgbValues(palette.background)
  const [r, g, b] = [0, 1, 2].map((i) =>
    Math.round((from[i] * percent + to[i] * (100 - percent)) / 100)
  )
  return `rgb(${r}, ${g}, ${b})`
}

export interface VariantColors {
  bg: string
  border: string
  color: string
}

// Reuses the theme's own `<type>Lighter`/`<type>Dark` tokens for the "light"
// variant instead of an alpha trick, so a custom theme's tokens are honored.
export const getVariantColors = (
  palette: BolioUIThemesPalette,
  type: SemanticColorType,
  variant: SurfaceVariant
): VariantColors => {
  const base = palette[type]

  switch (variant) {
    case 'filled':
      return { bg: base, border: base, color: '#fff' }
    case 'light':
      if (isDarkPalette(palette))
        return {
          bg: mixWithPage(palette, base, 14),
          border: mixWithPage(palette, base, 40),
          color: base
        }
      return {
        bg: palette[`${type}Lighter`],
        border: palette[`${type}Lighter`],
        color: palette[`${type}Dark`]
      }
    case 'outline':
      return { bg: palette.background, border: base, color: base }
    case 'subtle':
      return { bg: 'transparent', border: 'transparent', color: base }
  }
}
