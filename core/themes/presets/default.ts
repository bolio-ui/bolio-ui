import {
  BolioUIThemes,
  BolioUIThemesPalette,
  BolioUIThemesExpressiveness
} from './index'
import { defaultFont, defaultBreakpoints, defaultLayout } from './shared'

export const palette: BolioUIThemesPalette = {
  accents_1: '#fafafa',
  accents_2: '#eaeaea',
  accents_3: '#999',
  accents_4: '#888',
  accents_5: '#666',
  accents_6: '#444',
  accents_7: '#333',
  accents_8: '#111',
  background: '#fff',
  foreground: '#000',
  selection: '#cee4fe',
  secondary: '#666',
  code: '#C25FFF',
  border: '#eaeaea',
  info: '#22D8F4',
  infoLight: '#79FBF8',
  infoLighter: '#A6FDF4',
  infoDark: '#0A5D8D',
  error: '#FF615B',
  errorLight: '#FF9283',
  errorLighter: '#FFB09C',
  errorDark: '#931D36',
  success: '#A5E216',
  successLight: '#C2ED4C',
  successLighter: '#D6F670',
  successDark: '#528307',
  warning: '#FFA435',
  warningLight: '#FFC167',
  warningLighter: '#FFD385',
  warningDark: '#934710',
  cyan: '#50e3c2',
  cyanLighter: '#aaffec',
  cyanLight: '#79ffe1',
  cyanDark: '#29bc9b',
  violet: '#C25FFF',
  violetLighter: '#E59FFF',
  violetLight: '#8a63d2',
  violetDark: '#F2BFFF',
  purple: '#f81ce5',
  alert: '#ff0080',
  magenta: '#eb367f',
  link: '#0070f3'
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
