import React from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import ChartFrame from './ChartFrame'
import { getSeriesColor, getTooltipStyle } from './chart-theme'

export interface ChartSeries {
  name: string
  label?: string
  color?: string
  // only in CompositeChart: how the series is drawn, `line` when missing
  type?: 'line' | 'bar' | 'area'
  // only in CompositeChart: `right` needs `withRightYAxis`
  yAxisId?: 'left' | 'right'
}

export type ChartCurve = 'linear' | 'monotone' | 'step'

export interface ChartProps {
  data: Array<Record<string, string | number | null>>
  dataKey: string
  series: ChartSeries[]
  height?: number
  withLegend?: boolean
  withTooltip?: boolean
  withXAxis?: boolean
  withYAxis?: boolean
  withGrid?: boolean
  valueFormatter?: (value: number) => string
  className?: string
}

export type ChartNativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof ChartProps
>

type Kind = 'line' | 'area' | 'bar' | 'composite'

interface Props extends ChartProps {
  kind: Kind
  curve?: ChartCurve
  stacked?: boolean
  withDots?: boolean
  connectNulls?: boolean
  withRightYAxis?: boolean
}

const CartesianChart = React.forwardRef<
  HTMLDivElement,
  Props & ChartNativeAttrs
>(
  (
    {
      kind,
      data,
      dataKey,
      series,
      height = 300,
      withLegend = false,
      withTooltip = true,
      withXAxis = true,
      withYAxis = true,
      withGrid = true,
      valueFormatter,
      curve = 'monotone',
      stacked = false,
      withDots = true,
      connectNulls = false,
      withRightYAxis = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const animate = !useReducedMotion()
    const palette = theme.palette

    const colorOf = (item: ChartSeries, index: number) =>
      getSeriesColor(palette, index, item.color)
    const format = (value: unknown) =>
      typeof value === 'number' && valueFormatter
        ? valueFormatter(value)
        : value
    const stackId = stacked ? 'stack' : undefined

    const tick = { fill: palette.accents_5, fontSize: 12 }
    const common = {
      data,
      margin: { top: 8, right: 8, bottom: 0, left: 0 }
    }

    const parts = [
      withGrid && (
        <CartesianGrid
          key="grid"
          stroke={palette.accents_2}
          strokeDasharray="3 3"
          vertical={false}
        />
      ),
      <XAxis
        key="x"
        hide={!withXAxis}
        dataKey={dataKey}
        tick={tick}
        stroke={palette.accents_3}
        tickLine={false}
      />,
      <YAxis
        key="y"
        hide={!withYAxis}
        width="auto"
        tick={tick}
        stroke={palette.accents_3}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => String(format(value))}
      />,
      kind === 'composite' && withRightYAxis && (
        <YAxis
          key="right"
          yAxisId="right"
          orientation="right"
          hide={!withYAxis}
          width="auto"
          tick={tick}
          stroke={palette.accents_3}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => String(format(value))}
        />
      ),
      withTooltip && (
        <Tooltip
          key="tooltip"
          formatter={(value) => format(value) as React.ReactNode}
          cursor={{
            stroke: palette.accents_3,
            fill: palette.accents_2,
            fillOpacity: kind === 'bar' ? 0.5 : 1
          }}
          {...getTooltipStyle(theme)}
        />
      ),
      withLegend && (
        <Legend
          key="legend"
          iconType="circle"
          // the order of the series, not alphabetical
          itemSorter={null}
          formatter={(value) => (
            <span style={{ color: palette.foreground }}>{value}</span>
          )}
        />
      )
    ]

    let chart: React.ReactElement
    if (kind === 'line')
      chart = (
        <RechartsLineChart {...common}>
          {parts}
          {series.map((item, index) => (
            <Line
              key={item.name}
              type={curve}
              dataKey={item.name}
              name={item.label || item.name}
              stroke={colorOf(item, index)}
              strokeWidth={2}
              dot={withDots}
              connectNulls={connectNulls}
              isAnimationActive={animate}
            />
          ))}
        </RechartsLineChart>
      )
    else if (kind === 'area')
      chart = (
        <RechartsAreaChart {...common}>
          {parts}
          {series.map((item, index) => (
            <Area
              key={item.name}
              type={curve}
              dataKey={item.name}
              name={item.label || item.name}
              stroke={colorOf(item, index)}
              fill={colorOf(item, index)}
              fillOpacity={0.2}
              strokeWidth={2}
              stackId={stackId}
              connectNulls={connectNulls}
              isAnimationActive={animate}
            />
          ))}
        </RechartsAreaChart>
      )
    else if (kind === 'composite')
      chart = (
        <ComposedChart {...common}>
          {parts}
          {series.map((item, index) => {
            const color = colorOf(item, index)
            const shared = {
              dataKey: item.name,
              name: item.label || item.name,
              yAxisId: item.yAxisId === 'right' ? 'right' : undefined,
              isAnimationActive: animate
            }
            if (item.type === 'bar')
              return (
                <Bar
                  key={item.name}
                  {...shared}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                />
              )
            if (item.type === 'area')
              return (
                <Area
                  key={item.name}
                  {...shared}
                  type={curve}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  connectNulls={connectNulls}
                />
              )
            return (
              <Line
                key={item.name}
                {...shared}
                type={curve}
                stroke={color}
                strokeWidth={2}
                dot={withDots}
                connectNulls={connectNulls}
              />
            )
          })}
        </ComposedChart>
      )
    else
      chart = (
        <RechartsBarChart {...common}>
          {parts}
          {series.map((item, index) => (
            <Bar
              key={item.name}
              dataKey={item.name}
              name={item.label || item.name}
              fill={colorOf(item, index)}
              radius={stacked ? 0 : [4, 4, 0, 0]}
              stackId={stackId}
              isAnimationActive={animate}
            />
          ))}
        </RechartsBarChart>
      )

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        style={style}
        {...props}
      >
        {chart}
      </ChartFrame>
    )
  }
)

CartesianChart.displayName = 'BolioUICartesianChart'
export default CartesianChart
