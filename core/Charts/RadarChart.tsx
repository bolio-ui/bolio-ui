import React from 'react'
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  Tooltip
} from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import { withScale } from '../use-scale'
import ChartFrame from './ChartFrame'
import { getSeriesColor, getTooltipStyle } from './chart-theme'
import type { ChartSeries } from './CartesianChart'

interface Props {
  data: Array<Record<string, string | number | null>>
  dataKey: string
  series: ChartSeries[]
  height?: number
  withLegend?: boolean
  withTooltip?: boolean
  withPolarGrid?: boolean
  withPolarAngleAxis?: boolean
  withPolarRadiusAxis?: boolean
  withDots?: boolean
  valueFormatter?: (value: number) => string
  className?: string
}

export type RadarChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

const RadarChartComponent = React.forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      data,
      dataKey,
      series,
      height = 320,
      withLegend = false,
      withTooltip = true,
      withPolarGrid = true,
      withPolarAngleAxis = true,
      withPolarRadiusAxis = false,
      withDots = false,
      valueFormatter,
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

    return (
      <ChartFrame ref={ref} height={height} {...props}>
        <RechartsRadarChart data={data} outerRadius="75%">
          {withPolarGrid && <PolarGrid stroke={palette.accents_2} />}
          {withPolarAngleAxis && (
            <PolarAngleAxis dataKey={dataKey} tick={tick} />
          )}
          {withPolarRadiusAxis && (
            <PolarRadiusAxis
              tick={tick}
              stroke={palette.accents_3}
              tickFormatter={(value) => String(format(value))}
            />
          )}
          {withTooltip && (
            <Tooltip
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
          {series.map((item, index) => {
            const color = getSeriesColor(palette, index, item.color)
            return (
              <Radar
                key={item.name}
                dataKey={item.name}
                name={item.label || item.name}
                stroke={color}
                fill={color}
                fillOpacity={0.2}
                strokeWidth={2}
                dot={withDots}
                isAnimationActive={animate}
              />
            )
          })}
        </RechartsRadarChart>
      </ChartFrame>
    )
  }
)

RadarChartComponent.displayName = 'BolioUIRadarChart'
const RadarChart = withScale(RadarChartComponent)
export default RadarChart
