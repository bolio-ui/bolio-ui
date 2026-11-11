import React from 'react'
import {
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  Legend,
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
  withTooltip?: boolean
  withLegend?: boolean
  withLabels?: boolean
  labelsPosition?: 'left' | 'right' | 'inside'
  valueFormatter?: (value: number) => string
  className?: string
}

export type FunnelChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

const FunnelChartComponent = React.forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    {
      data,
      height = 300,
      withTooltip = true,
      withLegend = false,
      withLabels = true,
      labelsPosition = 'right',
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

    // Recharts paints each step with the `fill` of its row
    const rows = data.map((slice, index) => ({
      ...slice,
      fill: getSeriesColor(palette, index, slice.color)
    }))

    return (
      <ChartFrame ref={ref} height={height} {...props}>
        <RechartsFunnelChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          {withTooltip && (
            <Tooltip
              formatter={(value) => format(value) as React.ReactNode}
              {...getTooltipStyle(theme)}
            />
          )}
          {withLegend && (
            <Legend
              // Recharts builds no legend for a funnel by itself
              content={() => (
                <ul
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '4px 16px',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    fontSize: 14
                  }}
                >
                  {rows.map((row) => (
                    <li
                      key={row.name}
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: row.fill
                        }}
                      />
                      <span
                        className="recharts-legend-item-text"
                        style={{ color: palette.foreground }}
                      >
                        {row.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            />
          )}
          <Funnel
            data={rows}
            dataKey="value"
            nameKey="name"
            stroke={palette.background}
            isAnimationActive={animate}
          >
            {withLabels && (
              <LabelList
                position={
                  labelsPosition === 'inside' ? 'center' : labelsPosition
                }
                dataKey="name"
                stroke="none"
                fill={labelsPosition === 'inside' ? '#fff' : palette.foreground}
                fontSize={12}
                formatter={(name) => String(name)}
              />
            )}
          </Funnel>
        </RechartsFunnelChart>
      </ChartFrame>
    )
  }
)

FunnelChartComponent.displayName = 'BolioUIFunnelChart'
const FunnelChart = withScale(FunnelChartComponent)
export default FunnelChart
