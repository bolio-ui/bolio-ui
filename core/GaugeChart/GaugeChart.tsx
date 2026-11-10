import React from 'react'
import useTheme from '../use-theme'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getSeriesColor } from '../Charts/chart-theme'

export interface GaugeSection {
  // where the section ends, it starts where the one before ends
  value: number
  color?: string
}

interface Props {
  value: number
  min?: number
  max?: number
  sections?: GaugeSection[]
  target?: number
  size?: number
  thickness?: number
  startAngle?: number
  endAngle?: number
  roundCaps?: boolean
  type?: NormalTypes
  color?: string
  trackColor?: string
  targetColor?: string
  label?: React.ReactNode
  valueFormatter?: (value: number) => string
  className?: string
}

export type GaugeChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

// 0 degrees is the top and angles grow clockwise
const polar = (center: number, radius: number, degrees: number) => {
  const angle = (degrees * Math.PI) / 180
  return [center + radius * Math.sin(angle), center - radius * Math.cos(angle)]
}

const arc = (center: number, radius: number, from: number, to: number) => {
  // a full circle starts and ends on the same point, which draws nothing
  const span = Math.min(Math.abs(to - from), 359.99)
  const forward = to >= from
  const [x1, y1] = polar(center, radius, from)
  const [x2, y2] = polar(center, radius, from + (forward ? span : -span))
  return `M${x1} ${y1} A${radius} ${radius} 0 ${span > 180 ? 1 : 0} ${forward ? 1 : 0} ${x2} ${y2}`
}

const GaugeChartComponent = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      sections,
      target,
      size = 200,
      thickness = 14,
      startAngle = -120,
      endAngle = 120,
      roundCaps = false,
      type = 'primary',
      color,
      trackColor,
      targetColor,
      label,
      valueFormatter,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const palette = theme.palette

    const format = (number: number) =>
      valueFormatter ? valueFormatter(number) : number.toLocaleString('en-US')
    const center = size / 2
    // room for the target marker, which sticks out of the ring
    const radius = center - thickness / 2 - 4
    const angleOf = (number: number) => {
      const range = max - min
      const position = range ? (number - min) / range : 0
      return (
        startAngle +
        Math.min(Math.max(position, 0), 1) * (endAngle - startAngle)
      )
    }

    const fillColor = color || palette[type === 'default' ? 'foreground' : type]
    const cap = roundCaps ? 'round' : 'butt'
    const ring = {
      fill: 'none',
      strokeWidth: thickness
    }

    let previous = min
    const bands = (sections || []).map((section, index) => {
      const from = previous
      previous = Math.max(previous, section.value)
      return {
        key: index,
        d: arc(center, radius, angleOf(from), angleOf(section.value)),
        empty: section.value <= from,
        color: getSeriesColor(palette, index, section.color)
      }
    })

    const valueAngle = angleOf(value)
    const labelled = Boolean(props['aria-label'] || props['aria-labelledby'])
    const rootStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      width: SCALES.width(1, `${size}px`),
      height: SCALES.height(1, `${size}px`),
      maxWidth: '100%',
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        // a meter needs a name, so it only is one when it has one
        role={labelled ? 'meter' : undefined}
        aria-valuenow={labelled ? value : undefined}
        aria-valuemin={labelled ? min : undefined}
        aria-valuemax={labelled ? max : undefined}
        aria-valuetext={labelled ? format(value) : undefined}
        className={useClasses(className)}
        style={rootStyle}
        {...props}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          style={{ display: 'block' }}
        >
          <path
            d={arc(center, radius, startAngle, endAngle)}
            stroke={trackColor || palette.accents_2}
            strokeLinecap={cap}
            {...ring}
          />
          {sections
            ? bands.map(
                (band) =>
                  !band.empty && (
                    <path
                      key={band.key}
                      d={band.d}
                      stroke={band.color}
                      {...ring}
                    />
                  )
              )
            : valueAngle !== startAngle && (
                <path
                  d={arc(center, radius, startAngle, valueAngle)}
                  stroke={fillColor}
                  strokeLinecap={cap}
                  {...ring}
                />
              )}
          {target !== undefined && (
            <line
              x1={polar(center, radius - thickness / 2 - 3, angleOf(target))[0]}
              y1={polar(center, radius - thickness / 2 - 3, angleOf(target))[1]}
              x2={polar(center, radius + thickness / 2 + 3, angleOf(target))[0]}
              y2={polar(center, radius + thickness / 2 + 3, angleOf(target))[1]}
              stroke={targetColor || palette.foreground}
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: palette.foreground,
            fontWeight: 600,
            fontSize: size / 7,
            textAlign: 'center'
          }}
        >
          {label !== undefined ? label : format(value)}
        </div>
      </div>
    )
  }
)

GaugeChartComponent.displayName = 'BolioUIGaugeChart'
const GaugeChart = withScale(GaugeChartComponent)
export default GaugeChart
