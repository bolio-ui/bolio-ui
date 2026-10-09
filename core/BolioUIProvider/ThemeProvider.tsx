import React, { PropsWithChildren, useMemo } from 'react'
import Themes from '../Themes'
import { BolioUIThemes } from '../Themes/Presets'
import { ThemeContext } from '../use-theme/theme-context'
import {
  AllThemesConfig,
  AllThemesContext
} from '../use-all-themes/all-themes-context'

export interface Props {
  themeType?: string
  themes?: Array<BolioUIThemes>
}

const noThemes: Array<BolioUIThemes> = []

const ThemeProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  themeType,
  themes = noThemes
}) => {
  // Derived while rendering, not in an effect: with an effect a custom
  // theme only exists from the second render, so the first one falls back to
  // the preset (and flashes it) even when themeType names the custom theme.
  const allThemes = useMemo<AllThemesConfig>(() => {
    const safeThemes = themes.filter((item) =>
      Themes.isAvailableThemeType(item.type)
    )
    return { themes: Themes.getPresets().concat(safeThemes) }
  }, [themes])

  const currentTheme = useMemo<BolioUIThemes>(() => {
    const theme = allThemes.themes.find((item) => item.type === themeType)
    if (theme) return theme
    return Themes.getPresetStaticTheme()
  }, [allThemes, themeType])

  return (
    <AllThemesContext.Provider value={allThemes}>
      <ThemeContext.Provider value={currentTheme}>
        {children}
      </ThemeContext.Provider>
    </AllThemesContext.Provider>
  )
}

export default ThemeProvider
