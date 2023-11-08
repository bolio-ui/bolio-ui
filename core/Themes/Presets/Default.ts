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
  selection: '#cee4fe',
  code: '#C25FFF',
  border: '#eaeaea',
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
