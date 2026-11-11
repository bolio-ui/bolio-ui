import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Sparkline.module.css'

interface Props {
  data: Array<number | null>
  type?: NormalTypes
  color?: string
  trend?: boolean
  area?: boolean
  strokeWidth?: number
  connectNulls?: boolean
  className?: string
}

type NativeAttrs = Omit<React.SVGAttributes<SVGSVGElement>, keyof Props>
export type SparklineProps = Props & NativeAttrs

type Point = [number, number]

// The drawing area is 100 x 100; the vertical padding keeps the stroke inside.
const PAD = 4

const getSegments = (data: Array<number | null>, connectNulls: boolean) => {
  const values = data.filter((value): value is number => value !== null)
  const low = Math.min(...values)
  const high = Math.max(...values)
  const range = high - low
  const points: Array<Point | null> = data.map((value, index) => {
    if (value === null) return null
    const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
    const y =
      range === 0 ? 50 : PAD + (1 - (value - low) / range) * (100 - 2 * PAD)
    return [x, y]
  })
  if (connectNulls) return [points.filter((point): point is Point => !!point)]
  const segments: Point[][] = []
  let current: Point[] = []
  points.forEach((point) => {
    if (point) return current.push(point)
    if (current.length) segments.push(current)
    current = []
  })
  if (current.length) segments.push(current)
  return segments
}

const line = (segment: Point[]) =>
  // a single point is drawn as a zero length line, which the round cap shows as a dot
  (segment.length === 1 ? [...segment, segment[0]] : segment)
    .map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`)
    .join(' ')

const closed = (segment: Point[]) =>
  `${line(segment)} L${segment[segment.length - 1][0]} 100 L${segment[0][0]} 100 Z`

const SparklineComponent = React.forwardRef<SVGSVGElement, SparklineProps>(
  (
    {
      data,
      type = 'primary',
      color: userColor,
      trend = false,
      area = true,
      strokeWidth = 2,
      connectNulls = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const segments = useMemo(
      () => getSegments(data, connectNulls),
      [data, connectNulls]
    )

    const filled = data.filter((value): value is number => value !== null)
    let color =
      userColor || theme.palette[type === 'default' ? 'foreground' : type]
    if (!userColor && trend && filled.length > 1) {
      const change = filled[filled.length - 1] - filled[0]
      color =
        change > 0
          ? theme.palette.success
          : change < 0
            ? theme.palette.error
            : theme.palette.accents_5
    }

    const labelled = Boolean(props['aria-label'] || props['aria-labelledby'])
    const svgStyle = {
      width: SCALES.width(7.5),
      height: SCALES.height(2.5),
      color,
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        className={useClasses(styles.sparkline, className)}
        style={svgStyle}
        {...props}
      >
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            {area && segment.length > 1 && (
              <path d={closed(segment)} className={styles.area} />
            )}
            <path
              d={line(segment)}
              className={styles.line}
              strokeWidth={strokeWidth}
            />
          </React.Fragment>
        ))}
      </svg>
    )
  }
)

SparklineComponent.displayName = 'BolioUISparkline'
const Sparkline = withScale(SparklineComponent)
export default Sparkline
