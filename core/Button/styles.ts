import { BolioUIThemesPalette } from '../Themes/Presets'
import { ButtonTypes } from '../utils/prop-types'
import { ButtonProps } from './Button'
import { addColorAlpha } from '../utils/color'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'

export interface ButtonColorGroup {
  bg: string
  border: string
  color: string
}

export const getButtonGhostColors = (
  palette: BolioUIThemesPalette,
  type: ButtonTypes
): ButtonColorGroup | null =>
  isSemanticColorType(type) ? getVariantColors(palette, type, 'outline') : null

// A tinted background with the type's own theme "Lighter" token, distinct
// from the solid "filled" look (unlike a plain type, whose bg is the full color).
export const getButtonLightColors = (
  palette: BolioUIThemesPalette,
  type: ButtonTypes
): ButtonColorGroup | null =>
  isSemanticColorType(type) ? getVariantColors(palette, type, 'light') : null

// No background at all until you look at the drip/ghost states: just the
// type's color as text, for the quietest of the four variants.
export const getButtonSubtleColors = (
  palette: BolioUIThemesPalette,
  type: ButtonTypes
): ButtonColorGroup | null =>
  isSemanticColorType(type) ? getVariantColors(palette, type, 'subtle') : null

export const getButtonColors = (
  palette: BolioUIThemesPalette,
  props: ButtonProps
): ButtonColorGroup => {
  const { type, disabled, ghost, subtle } = props
  const colors: { [key in ButtonTypes]?: ButtonColorGroup } = {
    default: {
      bg: palette.accents_2,
      border: palette.accents_2,
      color: palette.foreground
    },
    primary: {
      bg: palette.primary,
      border: palette.primary,
      color: '#fff'
    },
    secondary: {
      bg: palette.secondary,
      border: palette.secondary,
      color: '#fff'
    },
    success: {
      bg: palette.success,
      border: palette.success,
      color: '#fff'
    },
    warning: {
      bg: palette.warning,
      border: palette.warning,
      color: '#fff'
    },
    error: {
      bg: palette.error,
      border: palette.error,
      color: '#fff'
    },
    info: {
      bg: palette.info,
      border: palette.info,
      color: '#fff'
    },
    abort: {
      bg: 'transparent',
      border: 'transparent',
      color: palette.accents_5
    }
  }
  if (disabled)
    return {
      bg: palette.accents_2,
      border: palette.accents_2,
      color: palette.accents_4
    }

  const withoutLightType = type?.replace('-light', '') as ButtonTypes
  const isLight = type?.endsWith('-light')
  const defaultColor = colors.default as ButtonColorGroup

  if (ghost)
    return getButtonGhostColors(palette, withoutLightType) || defaultColor
  if (subtle)
    return getButtonSubtleColors(palette, withoutLightType) || defaultColor
  if (isLight)
    return getButtonLightColors(palette, withoutLightType) || defaultColor
  return colors[withoutLightType] || defaultColor
}

export const getButtonGhostHoverColors = (
  palette: BolioUIThemesPalette,
  type: ButtonTypes
): ButtonColorGroup | null => {
  const colors: { [key in ButtonTypes]?: ButtonColorGroup } = {
    primary: {
      bg: palette.primary,
      border: palette.background,
      color: 'white'
    },
    secondary: {
      bg: palette.secondary,
      border: palette.background,
      color: 'white'
    },
    success: {
      bg: palette.success,
      border: palette.background,
      color: 'white'
    },
    warning: {
      bg: palette.warning,
      border: palette.background,
      color: 'white'
    },
    error: {
      bg: palette.error,
      border: palette.background,
      color: 'white'
    },
    info: {
      bg: palette.info,
      border: palette.background,
      color: 'white'
    }
  }
  const withoutLightType = type.replace('-light', '') as ButtonTypes
  return colors[withoutLightType] || null
}

export const getButtonHoverColors = (
  palette: BolioUIThemesPalette,
  props: ButtonProps
): ButtonColorGroup => {
  const { type, disabled, loading, shadow, ghost } = props
  const defaultColor = getButtonColors(palette, props)
  const alphaBackground = addColorAlpha(defaultColor.bg, 0.85)
  const colors: {
    [key in ButtonTypes]: Omit<ButtonColorGroup, 'color'> & {
      color?: string
    }
  } = {
    default: {
      bg: palette.background,
      border: palette.foreground
    },
    primary: {
      bg: palette.background,
      border: palette.primary
    },
    secondary: {
      bg: palette.background,
      border: palette.secondary
    },
    success: {
      bg: palette.background,
      border: palette.success
    },
    warning: {
      bg: palette.background,
      border: palette.warning
    },
    error: {
      bg: palette.background,
      border: palette.error
    },
    info: {
      bg: palette.background,
      border: palette.info
    },
    abort: {
      bg: 'transparent',
      border: 'transparent',
      color: palette.accents_5
    },
    'primary-light': {
      ...defaultColor,
      bg: alphaBackground
    },
    'secondary-light': {
      ...defaultColor,
      bg: alphaBackground
    },
    'success-light': {
      ...defaultColor,
      bg: alphaBackground
    },
    'warning-light': {
      ...defaultColor,
      bg: alphaBackground
    },
    'error-light': {
      ...defaultColor,
      bg: alphaBackground
    },
    'info-light': {
      ...defaultColor,
      bg: alphaBackground
    }
  }
  if (disabled)
    return {
      bg: palette.accents_2,
      border: palette.accents_2,
      color: '#ccc'
    }
  if (loading)
    return {
      ...defaultColor,
      color: 'transparent'
    }
  if (shadow) return defaultColor

  const hoverColor =
    (ghost ? getButtonGhostHoverColors(palette, type!) : colors[type!]) ||
    colors.default
  return {
    ...hoverColor,
    color: hoverColor.color || hoverColor.border
  }
}

export interface ButtonCursorGroup {
  cursor: string
  events: string
}

export const getButtonCursor = (
  disabled?: boolean,
  loading?: boolean
): ButtonCursorGroup => {
  if (disabled)
    return {
      cursor: 'not-allowed',
      events: 'auto'
    }
  if (loading)
    return {
      cursor: 'default',
      events: 'none'
    }

  return {
    cursor: 'pointer',
    events: 'auto'
  }
}

export const getButtonDripColor = (
  palette: BolioUIThemesPalette,
  props: ButtonProps
) => {
  const { type, subtle } = props
  if (subtle) return addColorAlpha(getButtonColors(palette, props).color, 0.25)

  const isLightHover = type?.endsWith('light')
  const hoverColors = getButtonHoverColors(palette, props)
  return isLightHover
    ? addColorAlpha(hoverColors.bg, 0.65)
    : addColorAlpha(palette.accents_3, 0.65)
}
