import {
  BolioUIThemes,
  BolioUIThemesPalette,
  BolioUIThemesExpressiveness
} from './index'
import { defaultFont, defaultBreakpoints, defaultLayout } from './Shared'

export const palette: BolioUIThemesPalette = {
  background: '#fff',
  foreground: '#000',
  accents_1: '#fafafa',
  accents_2: '#eaeaea',
  accents_3: '#999',
  accents_4: '#888',
  accents_5: '#666',
  accents_6: '#444',
  accents_7: '#333',
  accents_8: '#111',
  selection: 'rgba(206,228,254, 0.5)',
  code: '#C25FFF',
  border: '#eaeaea',
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
  link: '#0070f3',
  pre: '#363450'
}

export const expressiveness: BolioUIThemesExpressiveness = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.02)',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 5px 10px rgba(0, 0, 0, 0.12)',
  shadowMedium: '0 8px 30px rgba(0, 0, 0, 0.12)',
  shadowLarge: '0 30px 60px rgba(0, 0, 0, 0.12)',
  portalOpacity: 0.25
}

export const font = defaultFont

export const breakpoints = defaultBreakpoints

export const layout = defaultLayout

export const themes: BolioUIThemes = {
  type: 'light',
  font,
  layout,
  palette,
  breakpoints,
  expressiveness
}

export default themes
