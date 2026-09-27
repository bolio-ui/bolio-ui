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
    const classes = useClasses(styles.progress, { [styles.fixed]: fixed }, className)

    const progressStyle: React.CSSProperties = {
      backgroundColor: theme.palette.accents_2,
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
        <div
          className={styles.inner}
          title={`${percentValue}%`}
          style={{
            borderRadius: theme.layout.radius,
            backgroundColor: currentColor,
            width: `${percentValue}%`
          }}
        />
        <progress className={className} value={value} max={max} {...props} />
      </div>
    )
  }
)

ProgressComponent.displayName = 'BolioUIProgress'
const Progress = withScale(ProgressComponent)
export default Progress
