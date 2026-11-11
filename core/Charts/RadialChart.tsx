import React from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  Tooltip
} from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import useScale from '../use-scale'
import useClasses from '../use-classes'
import { getSeriesColor, getTooltipStyle } from './chart-theme'

export interface ChartSlice {
  name: string
  value: number
  color?: string
}

export type ChartLabelsType = 'value' | 'name' | 'percent'

export interface RadialChartProps {
  data: ChartSlice[]
  size?: number
  withTooltip?: boolean
  withLegend?: boolean
  withLabels?: boolean
  labelsType?: ChartLabelsType
  valueFormatter?: (value: number) => string
  paddingAngle?: number
  startAngle?: number
  endAngle?: number
  className?: string
}

export type RadialChartNativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof RadialChartProps
>

interface Props extends RadialChartProps {
  // a donut has a hole of `size - thickness`, a pie has none
  donut?: boolean
  thickness?: number
  chartLabel?: string | number
}

const LEGEND_HEIGHT = 36
// room around the ring for the labels
const LABEL_MARGIN = 32

const RadialChart = React.forwardRef<
  HTMLDivElement,
  Props & RadialChartNativeAttrs
>(
  (
    {
      data,
      size = 220,
      withTooltip = true,
      withLegend = false,
      withLabels = false,
      labelsType = 'value',
      valueFormatter,
      paddingAngle = 0,
      startAngle = 90,
      endAngle = -270,
      donut = false,
      thickness = 24,
      chartLabel,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const animate = !useReducedMotion()
    const palette = theme.palette

    const format = (value: number) =>
      valueFormatter ? valueFormatter(value) : value.toLocaleString('en-US')
    const total = data.reduce((sum, slice) => sum + slice.value, 0)
    const label = (slice: ChartSlice) => {
      if (labelsType === 'name') return slice.name
      if (labelsType === 'percent')
        return `${total ? Math.round((slice.value / total) * 100) : 0}%`
      return format(slice.value)
    }

    const height = size + (withLegend ? LEGEND_HEIGHT : 0)
    const outer = size / 2 - (withLabels ? LABEL_MARGIN : 4)
    const inner = donut ? Math.max(outer - thickness, 0) : 0

    const rootStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      width: SCALES.width(1, `${size}px`),
      maxWidth: '100%',
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        // a name is only valid on an element with a role
        role={
          props['aria-label'] || props['aria-labelledby'] ? 'group' : undefined
        }
        className={useClasses(className)}
        style={rootStyle}
        {...props}
      >
        <RechartsPieChart width={size} height={height}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx={size / 2}
            cy={size / 2}
            innerRadius={inner}
            outerRadius={outer}
            startAngle={startAngle}
            endAngle={endAngle}
            paddingAngle={paddingAngle}
            stroke={palette.background}
            strokeWidth={2}
            isAnimationActive={animate}
            labelLine={withLabels}
            label={
              withLabels
                ? (slice) => (
                    <text
                      x={slice.x}
                      y={slice.y}
                      fill={palette.foreground}
                      fontSize={12}
                      textAnchor={slice.textAnchor}
                      dominantBaseline="central"
                    >
                      {label(slice as unknown as ChartSlice)}
                    </text>
                  )
                : false
            }
          >
            {data.map((slice, index) => (
              <Cell
                key={`${slice.name}-${index}`}
                fill={getSeriesColor(palette, index, slice.color)}
              />
            ))}
          </Pie>
          {withTooltip && (
            <Tooltip
              formatter={(value) =>
                (typeof value === 'number'
                  ? format(value)
                  : value) as React.ReactNode
              }
              {...getTooltipStyle(theme)}
            />
          )}
          {withLegend && (
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              height={LEGEND_HEIGHT}
              // the order of the data, not alphabetical
              itemSorter={null}
              formatter={(value) => (
                <span style={{ color: palette.foreground }}>{value}</span>
              )}
            />
          )}
        </RechartsPieChart>
        {donut && chartLabel !== undefined && (
          <div
            style={{
              position: 'absolute',
              top: size / 2,
              left: size / 2,
              transform: 'translate(-50%, -50%)',
              color: palette.foreground,
              fontWeight: 600,
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            {chartLabel}
          </div>
        )}
      </div>
    )
  }
)

RadialChart.displayName = 'BolioUIRadialChart'
export default RadialChart
