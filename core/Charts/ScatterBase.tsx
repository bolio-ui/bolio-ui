import React from 'react'
import {
  CartesianGrid,
  Legend,
  Scatter,
  ScatterChart as RechartsScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import ChartFrame from './ChartFrame'
import { getSeriesColor, getTooltipStyle } from './chart-theme'

export interface ScatterSeries {
  name: string
  label?: string
  color?: string
  points: Array<{ x: number; y: number; z?: number }>
}

interface Props {
  data: ScatterSeries[]
  height?: number
  withLegend?: boolean
  withTooltip?: boolean
  withXAxis?: boolean
  withYAxis?: boolean
  withGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  valueFormatter?: (value: number) => string
  // a bubble chart sizes each point by its `z`, between these two areas
  sizeRange?: [number, number]
  zLabel?: string
  className?: string
}

export type ScatterBaseProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

const ScatterBase = React.forwardRef<HTMLDivElement, ScatterBaseProps>(
  (
    {
      data,
      height = 300,
      withLegend = false,
      withTooltip = true,
      withXAxis = true,
      withYAxis = true,
      withGrid = true,
      xAxisLabel,
      yAxisLabel,
      valueFormatter,
      sizeRange,
      zLabel,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const animate = !useReducedMotion()
    const palette = theme.palette
    const format = (value: unknown) =>
      typeof value === 'number' && valueFormatter
        ? valueFormatter(value)
        : value
    const tick = { fill: palette.accents_5, fontSize: 12 }
    const title = { fill: palette.accents_6, fontSize: 12 }

    return (
      <ChartFrame ref={ref} height={height} {...props}>
        <RechartsScatterChart margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          {withGrid && (
            <CartesianGrid stroke={palette.accents_2} strokeDasharray="3 3" />
          )}
          <XAxis
            type="number"
            dataKey="x"
            name={xAxisLabel || 'x'}
            hide={!withXAxis}
            tick={tick}
            stroke={palette.accents_3}
            tickLine={false}
            tickFormatter={(value) => String(format(value))}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: 'insideBottom',
                    offset: -2,
                    style: title
                  }
                : undefined
            }
            height={xAxisLabel ? 44 : 30}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yAxisLabel || 'y'}
            hide={!withYAxis}
            width="auto"
            tick={tick}
            stroke={palette.accents_3}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => String(format(value))}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { ...title, textAnchor: 'middle' }
                  }
                : undefined
            }
          />
          {sizeRange && (
            <ZAxis
              type="number"
              dataKey="z"
              range={sizeRange}
              name={zLabel || 'z'}
            />
          )}
          {withTooltip && (
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: palette.accents_3 }}
              formatter={(value) => format(value) as React.ReactNode}
              {...getTooltipStyle(theme)}
            />
          )}
          {withLegend && (
            <Legend
              iconType="circle"
              // the order of the series, not alphabetical
              itemSorter={null}
              formatter={(value) => (
                <span style={{ color: palette.foreground }}>{value}</span>
              )}
            />
          )}
          {data.map((item, index) => (
            <Scatter
              key={item.name}
              name={item.label || item.name}
              data={item.points}
              fill={getSeriesColor(palette, index, item.color)}
              isAnimationActive={animate}
            />
          ))}
        </RechartsScatterChart>
      </ChartFrame>
    )
  }
)

ScatterBase.displayName = 'BolioUIScatterBase'
export default ScatterBase
