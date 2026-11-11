import React from 'react'
import {
  Legend,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  Tooltip
} from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import { withScale } from '../use-scale'
import ChartFrame from './ChartFrame'
import { getSeriesColor, getTooltipStyle } from './chart-theme'
import type { ChartSlice } from './RadialChart'

interface Props {
  data: ChartSlice[]
  height?: number
  barSize?: number
  withBackground?: boolean
  withLabels?: boolean
  withLegend?: boolean
  withTooltip?: boolean
  startAngle?: number
  endAngle?: number
  valueFormatter?: (value: number) => string
  className?: string
}

export type RadialBarChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

const RadialBarChartComponent = React.forwardRef<
  HTMLDivElement,
  RadialBarChartProps
>(
  (
    {
      data,
      height = 300,
      barSize = 20,
      withBackground = true,
      withLabels = false,
      withLegend = false,
      withTooltip = true,
      startAngle = 90,
      endAngle = -270,
      valueFormatter,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const animate = !useReducedMotion()
    const palette = theme.palette
    const format = (value: unknown) =>
      typeof value === 'number'
        ? valueFormatter
          ? valueFormatter(value)
          : value.toLocaleString('en-US')
        : value

    const rows = data.map((slice, index) => ({
      ...slice,
      fill: getSeriesColor(palette, index, slice.color)
    }))

    return (
      <ChartFrame ref={ref} height={height} {...props}>
        <RechartsRadialBarChart
          data={rows}
          innerRadius="20%"
          outerRadius="100%"
          barSize={barSize}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          <RadialBar
            dataKey="value"
            background={withBackground ? { fill: palette.accents_2 } : false}
            isAnimationActive={animate}
            label={
              withLabels
                ? {
                    position: 'insideStart',
                    fill: '#fff',
                    fontSize: 11,
                    formatter: (value: unknown) => String(format(value))
                  }
                : false
            }
          />
          {withTooltip && (
            <Tooltip
              formatter={(value) => format(value) as React.ReactNode}
              {...getTooltipStyle(theme)}
            />
          )}
          {withLegend && (
            <Legend
              iconType="circle"
              // the order of the data, not alphabetical
              itemSorter={null}
              formatter={(value) => (
                <span style={{ color: palette.foreground }}>{value}</span>
              )}
            />
          )}
        </RechartsRadialBarChart>
      </ChartFrame>
    )
  }
)

RadialBarChartComponent.displayName = 'BolioUIRadialBarChart'
const RadialBarChart = withScale(RadialBarChartComponent)
export default RadialBarChart
