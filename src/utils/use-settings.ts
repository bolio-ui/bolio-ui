import { createContext, useContext } from 'react'

export const themes = ['light', 'dark'] as const
export type ThemeType = typeof themes[number]

interface Settings {
  themeType: ThemeType
  switchTheme: (type: ThemeType) => void
}

export const SettingsContext = createContext<Settings>({
  themeType: 'dark',
  switchTheme: () => {}
})

export const useSettings = (): Settings => useContext(SettingsContext)
