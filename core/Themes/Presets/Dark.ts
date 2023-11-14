import {
  BolioUIThemes,
  BolioUIThemesPalette,
  BolioUIThemesExpressiveness
} from './index'
import { defaultFont, defaultBreakpoints, defaultLayout } from './Shared'

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
  selection: 'rgba(248,28,229, 0.5)',
  code: '#C25FFF',
  border: '#333',
  primary: '#0072F6',
  primaryLight: '#CEE4FF',
  primaryLighter: '#96C1F3',
  primaryDark: '#00254E',
  secondary: '#7828C9',
  secondaryLight: '#EADCF9',
  secondaryLighter: '#D1B1F1',
  secondaryDark: '#290E45',
  error: '#F31261',
  errorLight: '#FDD8E6',
  errorLighter: '#FAA8C6',
  errorDark: '#4E041F',
  success: '#17C965',
  successLight: '#DAFBE9',
  successLighter: '#ADF5CD',
  successDark: '#06371C',
  warning: '#F5A525',
  warningLight: '#FDEFD9',
  warningLighter: '#FBDBA8',
  warningDark: '#4E3105',
  info: '#06B7DC',
  infoLight: '#D7F8FF',
  infoLighter: '#A5EEFE',
  infoDark: '#053B49',
  purple: '#f81ce5',
  alert: '#ff0080',
  link: '#3291ff',
  pre: '#111'
}

export const expressiveness: BolioUIThemesExpressiveness = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 0 0 1px #333',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 5px 10px rgba(255, 255, 255, 0.12)',
  shadowMedium: '0 8px 30px rgba(255, 255, 255, 0.12)',
  shadowLarge: '0 30px 60px rgba(255, 255, 255, 0.12)',
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
