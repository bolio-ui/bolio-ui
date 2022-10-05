import React from 'react'
import useTheme from '../use-theme'
import { useProportions } from '../utils/calculations'
import { BolioUIThemesPalette } from '../themes/presets'
import { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

export type ProgressColors = {
  [key: number]: string
}
export type ProgressTypes = NormalTypes

interface Props {
  value?: number
  max?: number
  fixedTop?: boolean
  fixedBottom?: boolean
  colors?: ProgressColors
  type?: ProgressTypes
  className?: string
}

type NativeAttrs = Omit<React.ProgressHTMLAttributes<any>, keyof Props>
export type ProgressProps = Props & NativeAttrs

const getCurrentColor = (
  ratio: number,
  palette: BolioUIThemesPalette,
  type: ProgressTypes,
  colors: ProgressColors = {}
): string => {
  const defaultColors: { [key in ProgressTypes]: string } = {
    default: palette.foreground,
    primary: palette.primary,
    success: palette.success,
    secondary: palette.secondary,
    warning: palette.warning,
    error: palette.error,
    info: palette.info
  }
  const colorKeys = Object.keys(colors)
  if (colorKeys.length === 0) return defaultColors[type]

  const customColorKey = colorKeys.find((key) => ratio <= +key)
  if (!customColorKey || Number.isNaN(+customColorKey))
    return defaultColors[type]
  return colors[+customColorKey]
}

function ProgressComponent({
  value = 0,
  max = 100,
  className = '',
  type = 'default' as ProgressTypes,
  colors,
  fixedTop = false,
  fixedBottom = false,
  ...props
}: ProgressProps) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const percentValue = useProportions(value, max)
  const currentColor = getCurrentColor(
    percentValue,
    theme.palette,
    type,
    colors
  )
  const fixed = fixedTop || fixedBottom
  const classes = useClasses('progress', { fixed }, className)

  return (
    <div className={classes}>
      <div className="inner" title={`${percentValue}%`} />
      <progress className={className} value={value} max={max} {...props} />
      <style jsx>{`
        progress {
          position: fixed;
          top: -1000px;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .progress {
          position: relative;
          background-color: ${theme.palette.accents_2};
          border-radius: ${theme.layout.radius};
          width: ${SCALES.width(1, '100%')};
          height: ${SCALES.height(0.625)};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }

        .fixed {
          position: fixed;
          top: ${fixedTop ? 0 : 'unset'};
          bottom: ${fixedBottom ? 0 : 'unset'};
          left: 0;
          border-radius: 0;
        }

        .fixed > .inner {
          border-radius: 0;
        }

        .inner {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          bottom: 0;
          transition: all 100ms ease-in;
          border-radius: ${theme.layout.radius};
          background-color: ${currentColor};
          width: ${percentValue}%;
        }
      `}</style>
    </div>
  )
}

ProgressComponent.displayName = 'BolioUIProgress'
const Progress = withScale(ProgressComponent)
export default Progress
