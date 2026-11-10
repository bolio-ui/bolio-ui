import React from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import { withScale } from '../use-scale'
import ChartFrame from './ChartFrame'
import { getTooltipStyle } from './chart-theme'

interface DataKeys {
  open: string
  high: string
  low: string
  close: string
}

interface Props {
  data: Array<Record<string, string | number>>
  dataKey: string
  dataKeys?: Partial<DataKeys>
  height?: number
  upColor?: string
  downColor?: string
  withTooltip?: boolean
  withXAxis?: boolean
  withYAxis?: boolean
  withGrid?: boolean
  labels?: Partial<DataKeys>
  valueFormatter?: (value: number) => string
  className?: string
}

export type CandlestickChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

const defaultKeys: DataKeys = {
  open: 'open',
  high: 'high',
  low: 'low',
  close: 'close'
}
const defaultLabels: DataKeys = {
  open: 'Open',
  high: 'High',
  low: 'Low',
  close: 'Close'
}

// What Recharts hands over to draw one bar
interface CandleShape {
  x: number
  y: number
  width: number
  height: number
  payload: Record<string, number>
}

const CandlestickChartComponent = React.forwardRef<
  HTMLDivElement,
  CandlestickChartProps
>(
  (
    {
      data,
      dataKey,
      dataKeys,
      height = 300,
      upColor,
      downColor,
      withTooltip = true,
      withXAxis = true,
      withYAxis = true,
      withGrid = true,
      labels,
      valueFormatter,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const animate = !useReducedMotion()
    const palette = theme.palette
    const keys = { ...defaultKeys, ...dataKeys }
    const names = { ...defaultLabels, ...labels }
    const up = upColor || palette.success
    const down = downColor || palette.error
    const format = (value: unknown) =>
      typeof value === 'number' && valueFormatter
        ? valueFormatter(value)
        : value
    const tick = { fill: palette.accents_5, fontSize: 12 }

    const lows = data.map((row) => Number(row[keys.low]))
    const highs = data.map((row) => Number(row[keys.high]))
    const low = Math.min(...lows)
    const high = Math.max(...highs)
    const pad = (high - low) * 0.05 || 1
    const domain: [number, number] = data.length
      ? [low - pad, high + pad]
      : [0, 1]

    // The bar spans from the low to the high, so inside it a price is a
    // position between the two: that draws the wick and the body.
    const renderCandle = ({
      x,
      y,
      width,
      height: span,
      payload
    }: CandleShape) => {
      const open = Number(payload[keys.open])
      const close = Number(payload[keys.close])
      const top = Number(payload[keys.high])
      const bottom = Number(payload[keys.low])
      const range = top - bottom
      const at = (price: number) =>
        range > 0 ? y + (span * (top - price)) / range : y
      const rising = close >= open
      const color = rising ? up : down
      const center = x + width / 2
      const body = Math.min(width * 0.7, 24)
      const bodyTop = at(Math.max(open, close))
      return (
        <g>
          <line
            x1={center}
            x2={center}
            y1={y}
            y2={y + span}
            stroke={color}
            strokeWidth={1.5}
          />
          <rect
            x={center - body / 2}
            y={bodyTop}
            width={body}
            height={Math.max(at(Math.min(open, close)) - bodyTop, 1.5)}
            // a rising candle is hollow and a falling one is solid, so the
            // direction does not rest on color alone
            fill={rising ? palette.background : color}
            stroke={color}
            strokeWidth={1.5}
          />
        </g>
      )
    }

    return (
      <ChartFrame ref={ref} height={height} {...props}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          {withGrid && (
            <CartesianGrid
              stroke={palette.accents_2}
              strokeDasharray="3 3"
              vertical={false}
            />
          )}
          <XAxis
            hide={!withXAxis}
            dataKey={dataKey}
            tick={tick}
            stroke={palette.accents_3}
            tickLine={false}
          />
          <YAxis
            hide={!withYAxis}
            width="auto"
            domain={domain}
            allowDataOverflow
            tick={tick}
            stroke={palette.accents_3}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => String(format(value))}
          />
          {withTooltip && (
            <Tooltip
              cursor={{
                stroke: palette.accents_3,
                fill: palette.accents_2,
                fillOpacity: 0.5
              }}
              {...getTooltipStyle(theme)}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null
                const row = payload[0].payload as Record<string, number>
                const style = getTooltipStyle(theme)
                return (
                  <div style={{ ...style.contentStyle, padding: '8px 12px' }}>
                    <div style={style.labelStyle}>{label}</div>
                    {(['open', 'high', 'low', 'close'] as const).map((name) => (
                      <div key={name} style={style.itemStyle}>
                        {names[name]}: {String(format(Number(row[keys[name]])))}
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          )}
          <Bar
            dataKey={(row: Record<string, number>) => [
              Number(row[keys.low]),
              Number(row[keys.high])
            ]}
            name="candle"
            shape={(props: unknown) => renderCandle(props as CandleShape)}
            isAnimationActive={animate}
          />
        </ComposedChart>
      </ChartFrame>
    )
  }
)

CandlestickChartComponent.displayName = 'BolioUICandlestickChart'
const CandlestickChart = withScale(CandlestickChartComponent)
export default CandlestickChart
