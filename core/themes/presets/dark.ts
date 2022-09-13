import {
  BolioUIThemes,
  BolioUIThemesPalette,
  BolioUIThemesExpressiveness
} from './index'
import { defaultFont, defaultBreakpoints, defaultLayout } from './shared'

export const palette: BolioUIThemesPalette = {
  accents_1: '#111',
  accents_2: '#333',
  accents_3: '#444',
  accents_4: '#666',
  accents_5: '#888',
  accents_6: '#999',
  accents_7: '#eaeaea',
  accents_8: '#fafafa',
  background: '#000',
  foreground: '#fff',
  selection: '#f81ce5',
  secondary: '#888',
  code: '#C25FFF',
  border: '#333',
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
  link: '#3291ff'
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
