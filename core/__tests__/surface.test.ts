import { Themes } from '..'
import { getSurface } from '../utils/surface'

describe('getSurface', () => {
  it('keeps the page color on a light theme', () => {
    const theme = Themes.getPresetStaticTheme()
    const surface = getSurface(theme)
    expect(surface.bg).toBe(theme.palette.background)
    expect(surface.hover).toBe(theme.palette.accents_2)
    expect(surface.shadow).toBe(theme.expressiveness.shadowMedium)
  })

  it('lifts the popup and adds a tight shadow, with no border line, on a dark theme', () => {
    const theme = Themes.getPresets()[1]
    const surface = getSurface(theme, theme.expressiveness.shadowLarge)
    expect(surface.bg).toBe(theme.palette.accents_3)
    expect(surface.hover).toBe(theme.palette.accents_4)
    expect(surface.shadow).toBe(
      `0 2px 6px rgb(0 0 0 / 40%), ${theme.expressiveness.shadowLarge}`
    )
  })
})
