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
  secondary: '#888',
  code: '#C25FFF',
  border: '#333',
  info: '#0072F5',
  infoLight: '#96C1F2',
  infoLighter: '#CEE4FE',
  infoDark: '#00254D',
  error: '#F31260',
  errorLight: '#FAA8C5',
  errorLighter: '#FDD8E5',
  errorDark: '#4E041E',
  success: '#17C964',
  successLight: '#ADF5CC',
  successLighter: '#DAFBE8',
  successDark: '#06371B',
  warning: '#F5A524',
  warningLight: '#FBDBA7',
  warningLighter: '#FDEFD8',
  warningDark: '#4E3104',
  cyan: '#06B7DB',
  cyanLighter: '#A5EEFD',
  cyanLight: '#D7F8FE',
  cyanDark: '#053B48',
  violet: '#7828C8',
  violetLighter: '#D1B1F0',
  violetLight: '#EADCF8',
  violetDark: '#290E44',
  purple: '#f81ce5',
  alert: '#ff0080',
  magenta: '#eb367f',
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
