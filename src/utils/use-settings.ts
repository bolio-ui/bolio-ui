import { createContext, useContext } from 'react'

export const themes = ['light', 'dark'] as const
export type ThemeType = (typeof themes)[number]
export type ThemePreference = ThemeType | 'system'

// Accent colors for the whole site. Default keeps the preset palette. The
// others stay away from the semantic colors (secondary, success, error...),
// otherwise a primary component looks the same as one of those types.
export const accents = [
  { name: 'Default', color: '#60A5FA' },
  { name: 'Cyan', color: '#22D3EE' },
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Teal', color: '#14B8A6' },
  { name: 'Fuchsia', color: '#D946EF' },
  { name: 'Lime', color: '#A3E635' },
  { name: 'Amber', color: '#FACC15' },
  { name: 'Slate', color: '#64748B' }
] as const
export type AccentName = (typeof accents)[number]['name']

// Mixes a hex color with white or black, to derive the light and dark shades
export const mix = (hex: string, target: number, amount: number) => {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const out = channels.map((c) => Math.round(c + (target - c) * amount))
  return `#${out.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

interface Settings {
  themeType: ThemeType
  themePreference: ThemePreference
  switchTheme: (preference: ThemePreference) => void
  accent: AccentName
  switchAccent: (accent: AccentName) => void
}

export const SettingsContext = createContext<Settings>({
  themeType: 'dark',
  themePreference: 'dark',
  switchTheme: () => {},
  accent: 'Default',
  switchAccent: () => {}
})

export const useSettings = (): Settings => useContext(SettingsContext)
