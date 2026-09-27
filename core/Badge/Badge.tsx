import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'
import type { AnyElement } from '../utils/types'

export type BadgeTypes = NormalTypes

interface Props {
  type?: BadgeTypes
  dot?: boolean
  ghost?: boolean
  light?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type BadgeProps = Props & NativeAttrs

export type BadgeColors = { bg: string; border: string; color: string }

const getColors = (
  type: BadgeTypes,
  palette: BolioUIThemesPalette,
  { ghost, light, subtle }: { ghost: boolean; light: boolean; subtle: boolean }
): BadgeColors => {
  if (isSemanticColorType(type)) {
    const variant = subtle
      ? 'subtle'
      : light
        ? 'light'
        : ghost
          ? 'outline'
          : 'filled'
    return getVariantColors(palette, type, variant)
  }
  // 'default' has no semantic color: a plain neutral chip either way.
  return {
    bg: palette.accents_2,
    border: palette.accents_2,
    color: palette.foreground
  }
}

const BadgeComponent = React.forwardRef<
  HTMLSpanElement,
  React.PropsWithChildren<BadgeProps>
>(
  (
    {
      type = 'default' as BadgeTypes,
      className = '',
      children,
      dot = false,
      ghost = false,
      light = false,
      subtle = false,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const { bg, border, color } = useMemo(
      () => getColors(type, theme.palette, { ghost, light, subtle }),
      [type, theme.palette, ghost, light, subtle]
    )

    const classes = useClasses('badge', { dot }, className)

    return (
      <span ref={ref} className={classes} {...props}>
        {!dot && children}
        <style jsx>{`
          .badge {
            display: inline-block;
            box-sizing: border-box;
            border-radius: 16px;
            font-variant: tabular-nums;
            line-height: 1;
            vertical-align: middle;
            background-color: ${bg};
            color: ${color};
            border: 1px solid ${border};
            font-size: ${SCALES.font(0.875)};
            font-weight: bold;
            text-transform: none;
            width: ${SCALES.width(1, 'auto')};
            height: ${SCALES.height(1, 'auto')};
            padding: ${SCALES.pt(0.5)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }

          .dot {
            padding: ${SCALES.py(0.25)} ${SCALES.px(0.25)};
            border-radius: 50%;
            user-select: none;
          }
        `}</style>
      </span>
    )
  }
)

BadgeComponent.displayName = 'BolioUIBadge'
const Badge = withScale(BadgeComponent)
export default Badge
