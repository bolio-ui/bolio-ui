import type { BolioUIThemes, BolioUIThemesPalette } from '../Themes/Presets'
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
