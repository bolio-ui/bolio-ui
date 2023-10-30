import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

export type BadgeTypes = NormalTypes

interface Props {
  type?: BadgeTypes
  dot?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type BadgeProps = Props & NativeAttrs

const getBgColor = (type: NormalTypes, palette: BolioUIThemesPalette) => {
  const colors: { [key in NormalTypes]: string } = {
    default: palette.foreground,
    secondary: palette.secondary,
    primary: palette.primary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info
  }
  return colors[type]
}

function BadgeComponent({
  type = 'default' as BadgeTypes,
  className = '',
  children,
  dot = false,
  ...props
}: BadgeProps) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const bg = useMemo(
    () => getBgColor(type, theme.palette),
    [type, theme.palette]
  )

  const color = useMemo(() => {
    if (!type || type === 'default') return theme.palette.background
    return 'white'
  }, [type, theme.palette.background])

  const classes = useClasses('badge', { dot }, className)

  return (
    <span className={classes} {...props}>
      {!dot && children}
      <style jsx>{`
        .badge {
          display: inline-block;
          border-radius: 16px;
          font-variant: tabular-nums;
          line-height: 1;
          vertical-align: middle;
          background-color: ${bg};
          color: ${color};
          border: 0;
          font-size: ${SCALES.font(0.875)};
          font-weight: 500;
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

BadgeComponent.displayName = 'BolioUIBadge'
const Badge = withScale(BadgeComponent)
export default Badge
