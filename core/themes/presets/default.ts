import {
  BolioUIThemes,
  BolioUIThemesPalette,
  BolioUIThemesExpressiveness
} from './index'
import { defaultFont, defaultBreakpoints, defaultLayout } from './shared'

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
  secondary: '#666',
  code: '#C25FFF',
  border: '#eaeaea',
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
