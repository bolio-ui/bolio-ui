import React from 'react'
import useTheme from '../use-theme'
import { useProportions } from '../utils/calculations'
import { BolioUIThemesPalette } from '../Themes/Presets'
import { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Progress.module.css'

export type ProgressColors = {
  [key: number]: string
}
export type ProgressTypes = NormalTypes

interface Props {
  value?: number
  max?: number
  fixedTop?: boolean
  fixedBottom?: boolean
  segments?: number
  circular?: boolean
  colors?: ProgressColors
  type?: ProgressTypes
  className?: string
}

type NativeAttrs = Omit<React.ProgressHTMLAttributes<AnyElement>, keyof Props>
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

const ProgressComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ProgressProps>
>(
  (
    {
      value = 0,
      max = 100,
      className = '',
      type = 'default' as ProgressTypes,
      colors,
      fixedTop = false,
      fixedBottom = false,
      segments,
      circular = false,
      style,
      ...props
    },
    ref
  ) => {
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
    const classes = useClasses(
      styles.progress,
      { [styles.fixed]: fixed },
      className
    )

    const hidden = (
      <progress className={className} value={value} max={max} {...props} />
    )

    if (circular) {
      const size = SCALES.width(1, '3em')
      return (
        <div
          ref={ref}
          className={`${styles.circular} ${className}`.trim()}
          style={{
            width: size,
            height: size,
            margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
            ...style
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              strokeWidth="3"
              stroke={theme.palette.accents_2}
            />
            <circle
              className={styles.arc}
              cx="18"
              cy="18"
              r="16"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              stroke={currentColor}
              pathLength={100}
              strokeDasharray={`${percentValue} 100`}
            >
              <title>{`${percentValue}%`}</title>
            </circle>
          </svg>
          {hidden}
        </div>
      )
    }

    const progressStyle: React.CSSProperties = {
      backgroundColor: segments ? 'transparent' : theme.palette.accents_2,
      borderRadius: theme.layout.radius,
      width: SCALES.width(1, '100%'),
      height: SCALES.height(0.625),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      top: fixed ? (fixedTop ? 0 : 'unset') : undefined,
      bottom: fixed ? (fixedBottom ? 0 : 'unset') : undefined,
      ...style
    }

    return (
      <div ref={ref} className={classes} style={progressStyle}>
        {segments ? (
          <div className={styles.segments} title={`${percentValue}%`}>
            {[...Array(Math.max(1, Math.floor(segments)))].map((_, index) => (
              <span
                key={index}
                className={styles.segment}
                style={{
                  borderRadius: theme.layout.radius,
                  backgroundColor:
                    index < Math.round((percentValue / 100) * segments)
                      ? currentColor
                      : theme.palette.accents_2
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className={styles.inner}
            title={`${percentValue}%`}
            style={{
              borderRadius: theme.layout.radius,
              backgroundColor: currentColor,
              width: `${percentValue}%`
            }}
          />
        )}
        {hidden}
      </div>
    )
  }
)

ProgressComponent.displayName = 'BolioUIProgress'
const Progress = withScale(ProgressComponent)
export default Progress
