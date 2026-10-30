import React from 'react'
import Themes from '../Themes'
import type { BolioUIThemes } from '../Themes/Presets'

const defaultTheme = Themes.getPresetStaticTheme()

export const ThemeContext: React.Context<BolioUIThemes> =
  React.createContext<BolioUIThemes>(defaultTheme)

export const useTheme = (): BolioUIThemes =>
  React.useContext<BolioUIThemes>(ThemeContext)
