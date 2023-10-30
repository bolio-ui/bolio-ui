import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { SnippetTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'

export type TagTypes = SnippetTypes
interface Props {
  type?: TagTypes
  invert?: boolean
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
  invert: boolean
) => {
  const colors: {
    [key in TagTypes]: Pick<TagColors, 'color'> & Partial<TagColors>
  } = {
    default: {
      color: palette.foreground
    },
    primary: {
      color: palette.primary
    },
    secondary: {
      color: palette.secondary
    },
    success: {
      color: palette.success
    },
    warning: {
      color: palette.warning
    },
    error: {
      color: palette.error
    },
    info: {
      color: palette.info
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

  const cardStyle = {
    ...colors[type],
    bgColor: colors[type].bgColor || palette.background,
    borderColor: hideBorder ? 'transparent' : colors[type].color
  }

  return !invert
    ? cardStyle
    : {
        ...cardStyle,
        color: cardStyle.bgColor,
        bgColor: cardStyle.color
      }
}

function TagComponent({
  type = 'default' as TagTypes,
  children,
  className = '',
  invert = false,
  ...props
}: React.PropsWithChildren<TagProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()
  const { color, bgColor, borderColor } = useMemo(
    () => getColors(type, theme.palette, invert),
    [type, theme.palette, invert]
  )

  return (
    <span className={className} {...props}>
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

TagComponent.displayName = 'BolioUITag'
const Tag = withScale(TagComponent)
export default Tag
