import type { BolioUIThemes, BolioUIThemesPalette } from '../Themes/Presets'
import type { NormalTypes } from '../utils/prop-types'
import { getSurface } from '../utils/surface'

// The colors an item gets when it does not set one, in order
const order = [
  'primary',
  'success',
  'warning',
  'error',
  'info',
  'secondary'
] as const

export const getSeriesColor = (
  palette: BolioUIThemesPalette,
  index: number,
  color?: string
) => color || palette[order[index % order.length]]

// Style props of the Recharts tooltip, so it looks like the other popups
export const getTooltipStyle = (theme: BolioUIThemes) => {
  const surface = getSurface(theme)
  const { palette } = theme
  return {
    contentStyle: {
      background: surface.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: theme.layout.radius,
      boxShadow: surface.shadow,
      color: palette.foreground
    },
    itemStyle: { color: palette.foreground },
    labelStyle: { color: palette.foreground, fontWeight: 600 }
  }
}

// Four steps of a color, from light to full, for charts that color by value
export const getLevels = (
  palette: BolioUIThemesPalette,
  type: NormalTypes,
  colors?: string[]
) => {
  if (colors && colors.length) return colors
  const base = palette[type === 'default' ? 'foreground' : type]
  return [30, 55, 80, 100].map(
    (percent) =>
      `color-mix(in srgb, ${base} ${percent}%, ${palette.background})`
  )
}

// The lowest value gets the first level and the highest gets the last
export const getLevelColor = (
  value: number | null | undefined,
  domain: [number, number],
  levels: string[],
  empty: string
) => {
  if (value === null || value === undefined || value <= 0) return empty
  const [low, high] = domain
  const position = high === low ? 1 : (value - low) / (high - low)
  return levels[
    Math.round(Math.min(Math.max(position, 0), 1) * (levels.length - 1))
  ]
}
