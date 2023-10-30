import React from 'react'
import Themes from '../Themes/Themes'
import { BolioUIThemes } from '../Themes/Presets'

export type AllThemesConfig = {
  themes: Array<BolioUIThemes>
}

const defaultAllThemesConfig = {
  themes: Themes.getPresets()
}

export const AllThemesContext: React.Context<AllThemesConfig> =
  React.createContext<AllThemesConfig>(defaultAllThemesConfig)

export const useAllThemes = (): AllThemesConfig =>
  React.useContext<AllThemesConfig>(AllThemesContext)
