import React from 'react'
import Themes from '../themes'
import { BolioUIThemes } from '../themes/presets'

const defaultTheme = Themes.getPresetStaticTheme()

export const ThemeContext: React.Context<BolioUIThemes> =
  React.createContext<BolioUIThemes>(defaultTheme)

export const useTheme = (): BolioUIThemes =>
  React.useContext<BolioUIThemes>(ThemeContext)
