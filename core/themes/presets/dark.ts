import {
  BolioUIThemes,
  BolioUIThemesPalette,
  BolioUIThemesExpressiveness
} from './index'
import { defaultFont, defaultBreakpoints, defaultLayout } from './shared'

export const palette: BolioUIThemesPalette = {
  background: '#000',
  foreground: '#fff',
  accents_1: '#111',
  accents_2: '#333',
  accents_3: '#444',
  accents_4: '#666',
  accents_5: '#888',
  accents_6: '#999',
  accents_7: '#eaeaea',
  accents_8: '#fafafa',
  selection: '#f81ce5',
  code: '#C25FFF',
  border: '#444',
  primary: '#0072F6',
  primaryLight: '#96C1F3',
  primaryLighter: '#CEE4FF',
  primaryDark: '#00254E',
  secondary: '#7828C9',
  secondaryLighter: '#D1B1F1',
  secondaryLight: '#EADCF9',
  secondaryDark: '#290E45',
  error: '#F31261',
  errorLight: '#FAA8C6',
  errorLighter: '#FDD8E6',
  errorDark: '#4E041F',
  success: '#17C965',
  successLight: '#ADF5CD',
  successLighter: '#DAFBE9',
  successDark: '#06371C',
  warning: '#F5A525',
  warningLight: '#FBDBA8',
  warningLighter: '#FDEFD9',
  warningDark: '#4E3105',
  info: '#06B7DC',
  infoLighter: '#A5EEFE',
  infoLight: '#D7F8FF',
  infoDark: '#053B49',
  purple: '#f81ce5',
  alert: '#ff0080',
  link: '#3291ff',
  pre: '#363450'
}

export const expressiveness: BolioUIThemesExpressiveness = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 0 0 1px #333',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 0 0 1px #333',
  shadowMedium: '0 0 0 1px #333',
  shadowLarge: '0 0 0 1px #333',
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
