import { BolioUIThemesPalette } from '../Themes/Presets'

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

export type SemanticColorType = typeof SEMANTIC_COLOR_TYPES[number]

export const isSemanticColorType = (type?: string): type is SemanticColorType =>
  !!type && (SEMANTIC_COLOR_TYPES as ReadonlyArray<string>).includes(type)

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
