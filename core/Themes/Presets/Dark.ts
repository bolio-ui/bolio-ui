import {
  BolioUIThemes,
  BolioUIThemesPalette,
  BolioUIThemesExpressiveness
} from './index'
import { defaultFont, defaultBreakpoints, defaultLayout } from './Shared'

export const palette: BolioUIThemesPalette = {
  background: '#08090c',
  foreground: '#fff',
  accents_1: '#0d0e12',
  accents_2: '#101216',
  accents_3: '#171a20',
  accents_4: '#23262e',
  accents_5: '#757b88',
  accents_6: '#7e838d',
  accents_7: '#9aa0aa',
  accents_8: '#f2f3f5',
  selection: 'rgba(248,28,229, 0.5)',
  code: '#C25FFF',
  border: '#101216',
  primary: '#60A5FA',
  primaryLight: '#D7E9FE',
  primaryLighter: '#A6CDFC',
  primaryDark: '#03346F',
  secondary: '#A78BFA',
  secondaryLight: '#E1D8FD',
  secondaryLighter: '#BCA7FB',
  secondaryDark: '#23057B',
  error: '#F87171',
  errorLight: '#FDD8D8',
  errorLighter: '#FBA8A8',
  errorDark: '#720606',
  success: '#4ADE80',
  successLight: '#DCF9E7',
  successLighter: '#B1F1C9',
  successDark: '#0F5328',
  warning: '#FFD666',
  warningLight: '#FFF4D6',
  warningLighter: '#FFE6A3',
  warningDark: '#765600',
  info: '#FF6A3D',
  infoLight: '#FFE0D6',
  infoLighter: '#FFB8A3',
  infoDark: '#681800',
  purple: '#F472B6',
  alert: '#ff0080',
  link: '#3291ff',
  pre: '#0d0e12'
}

export const expressiveness: BolioUIThemesExpressiveness = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 0 0 1px #101216',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 5px 10px rgba(0, 0, 0, 0.3)',
  shadowMedium: '0 8px 30px rgba(0, 0, 0, 0.35)',
  shadowLarge: '0 30px 60px rgba(0, 0, 0, 0.45)',
  portalOpacity: 0.75
}

export const font = defaultFont

export const breakpoints = defaultBreakpoints

export const layout = defaultLayout

export const themes: BolioUIThemes = {
  type: 'dark',
  font,
  layout,
  palette,
  breakpoints,
  expressiveness
}

export default themes
