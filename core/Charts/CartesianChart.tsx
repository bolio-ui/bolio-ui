import React from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import useScale from '../use-scale'
import useClasses from '../use-classes'
import { getSeriesColor, getTooltipStyle } from './chart-theme'

export interface ChartSeries {
  name: string
  label?: string
  color?: string
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

type Kind = 'line' | 'area' | 'bar'

interface Props extends ChartProps {
  kind: Kind
  curve?: ChartCurve
  stacked?: boolean
  withDots?: boolean
  connectNulls?: boolean
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

    const rootStyle: React.CSSProperties = {
      width: SCALES.width(1, '100%'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

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
        <ResponsiveContainer
          width="100%"
          height={height}
          initialDimension={{ width: 600, height }}
        >
          {chart}
        </ResponsiveContainer>
      </div>
    )
  }
)

CartesianChart.displayName = 'BolioUICartesianChart'
export default CartesianChart
