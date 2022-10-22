export interface BolioUIThemesPalette {
  background: string
  foreground: string
  accents_1: string
  accents_2: string
  accents_3: string
  accents_4: string
  accents_5: string
  accents_6: string
  accents_7: string
  accents_8: string
  selection: string
  code: string
  border: string
  success: string
  successLighter: string
  successLight: string
  successDark: string
  primary: string
  primaryLighter: string
  primaryLight: string
  primaryDark: string
  secondary: string
  secondaryLighter: string
  secondaryLight: string
  secondaryDark: string
  error: string
  errorLighter: string
  errorLight: string
  errorDark: string
  warning: string
  warningLighter: string
  warningLight: string
  warningDark: string
  info: string
  infoLighter: string
  infoLight: string
  infoDark: string
  link: string
  purple: string
  alert: string
  pre: string
}

export interface BolioUIThemesExpressiveness {
  linkStyle: string
  linkHoverStyle: string
  dropdownBoxShadow: string
  scrollerStart: string
  scrollerEnd: string
  shadowSmall: string
  shadowMedium: string
  shadowLarge: string
  portalOpacity: number
}

export interface BolioUIThemesLayout {
  gap: string
  gapNegative: string
  gapHalf: string
  gapHalfNegative: string
  gapQuarter: string
  gapQuarterNegative: string
  pageMargin: string
  pageWidth: string
  pageWidthWithMargin: string
  breakpointMobile: string
  breakpointTablet: string
  radius: string
  unit: string
}

export interface BolioUIThemesFont {
  sans: string
  mono: string
  prism: string
}

export interface BreakpointsItem {
  min: string
  max: string
}

export interface BolioUIThemesBreakpoints {
  xs: BreakpointsItem
  sm: BreakpointsItem
  md: BreakpointsItem
  lg: BreakpointsItem
  xl: BreakpointsItem
}

export interface BolioUIThemes {
  type: string
  font: BolioUIThemesFont
  layout: BolioUIThemesLayout
  palette: BolioUIThemesPalette
  breakpoints: BolioUIThemesBreakpoints
  expressiveness: BolioUIThemesExpressiveness
}
