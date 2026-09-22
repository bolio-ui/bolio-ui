import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { SnippetTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'

export type TagTypes = SnippetTypes
interface Props {
  type?: TagTypes
  invert?: boolean
  light?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type TagProps = Props & NativeAttrs

export type TagColors = {
  color: string
  bgColor: string
  borderColor: string
}

const getColors = (
  type: TagTypes,
  palette: BolioUIThemesPalette,
  {
    invert,
    light,
    subtle
  }: { invert: boolean; light: boolean; subtle: boolean }
): TagColors => {
  // The 4 standard variants (outline is the default, invert is "filled")
  // only make sense for the 6 semantic colors.
  if (isSemanticColorType(type)) {
    const variant = subtle
      ? 'subtle'
      : light
      ? 'light'
      : invert
      ? 'filled'
      : 'outline'
    const { bg, border, color } = getVariantColors(palette, type, variant)
    return { color, bgColor: bg, borderColor: border }
  }

  const colors: {
    [key in 'default' | 'dark' | 'lite']: Pick<TagColors, 'color'> &
      Partial<TagColors>
  } = {
    default: {
      color: palette.foreground
    },
    dark: {
      color: palette.background,
      bgColor: palette.foreground
    },
    lite: {
      color: palette.foreground,
      bgColor: palette.accents_2
    }
  }
  const hideBorder = invert || type === 'lite'
  const key = type as 'default' | 'dark' | 'lite'

  const cardStyle = {
    ...colors[key],
    bgColor: colors[key].bgColor || palette.background,
    borderColor: hideBorder ? 'transparent' : colors[key].color
  }

  return !invert
    ? cardStyle
    : {
        ...cardStyle,
        color: cardStyle.bgColor,
        bgColor: cardStyle.color
      }
}

const TagComponent = React.forwardRef<
  HTMLSpanElement,
  React.PropsWithChildren<TagProps>
>(
  (
    {
      type = 'default' as TagTypes,
      children,
      className = '',
      invert = false,
      light = false,
      subtle = false,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const { color, bgColor, borderColor } = useMemo(
      () => getColors(type, theme.palette, { invert, light, subtle }),
      [type, theme.palette, invert, light, subtle]
    )

    return (
      <span ref={ref} className={className} {...props}>
        {children}
        <style jsx>{`
          span {
            display: inline-block;
            border: 1px solid ${borderColor};
            background-color: ${bgColor};
            color: ${color};
            box-sizing: border-box;
            line-height: 1em;
            border-radius: ${SCALES.height(0.3125)};
            font-size: ${SCALES.font(0.875)};
            width: ${SCALES.width(1, 'auto')};
            height: ${SCALES.height(1.75)};
            padding: ${SCALES.pt(0.375)} ${SCALES.pr(0.375)} ${SCALES.pb(0.375)}
              ${SCALES.pl(0.375)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }
        `}</style>
      </span>
    )
  }
)

TagComponent.displayName = 'BolioUITag'
const Tag = withScale(TagComponent)
export default Tag
