import React from 'react'
import { Sankey, Tooltip } from 'recharts'
import useTheme from '../use-theme'
import { withScale } from '../use-scale'
import ChartFrame from './ChartFrame'
import { getSeriesColor, getTooltipStyle } from './chart-theme'

export interface SankeyNode {
  name: string
  color?: string
}

export interface SankeyLink {
  // positions in `nodes`
  source: number
  target: number
  value: number
}

interface Props {
  data: { nodes: SankeyNode[]; links: SankeyLink[] }
  height?: number
  nodeWidth?: number
  nodePadding?: number
  withTooltip?: boolean
  valueFormatter?: (value: number) => string
  className?: string
}

export type SankeyChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

// What Recharts hands over to draw a node and a link
interface SankeyNodeShape {
  x: number
  y: number
  width: number
  height: number
  index: number
  containerWidth: number
  payload: { name: string }
}

interface SankeyLinkShape {
  sourceX: number
  targetX: number
  sourceY: number
  targetY: number
  sourceControlX: number
  targetControlX: number
  linkWidth: number
  index: number
  payload: { source: { index?: number } | number }
}

const SankeyChartComponent = React.forwardRef<HTMLDivElement, SankeyChartProps>(
  (
    {
      data,
      height = 320,
      nodeWidth = 12,
      nodePadding = 24,
      withTooltip = true,
      valueFormatter,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const palette = theme.palette
    const format = (value: unknown) =>
      typeof value === 'number'
        ? valueFormatter
          ? valueFormatter(value)
          : value.toLocaleString('en-US')
        : value
    const colors = data.nodes.map((node, index) =>
      getSeriesColor(palette, index, node.color)
    )

    // Recharts hands over the geometry, the colors and labels are ours
    const renderNode = ({
      x,
      y,
      width,
      height,
      index,
      containerWidth,
      payload
    }: SankeyNodeShape) => {
      const right = x + width / 2 < containerWidth / 2
      return (
        <g key={index}>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colors[index]}
          />
          <text
            x={right ? x + width + 6 : x - 6}
            y={y + height / 2}
            textAnchor={right ? 'start' : 'end'}
            dominantBaseline="central"
            fill={palette.foreground}
            fontSize={12}
          >
            {payload.name}
          </text>
        </g>
      )
    }
    const renderLink = ({
      sourceX,
      targetX,
      sourceY,
      targetY,
      sourceControlX,
      targetControlX,
      linkWidth,
      index,
      payload
    }: SankeyLinkShape) => (
      <path
        key={index}
        d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
        fill="none"
        stroke={
          colors[
            typeof payload.source === 'number'
              ? payload.source
              : (payload.source.index ?? -1)
          ] || palette.accents_4
        }
        strokeOpacity={0.3}
        strokeWidth={linkWidth}
      />
    )

    return (
      <ChartFrame ref={ref} height={height} {...props}>
        <Sankey
          data={data}
          nodeWidth={nodeWidth}
          nodePadding={nodePadding}
          margin={{ top: 8, right: 100, bottom: 8, left: 8 }}
          node={(props) => renderNode(props as unknown as SankeyNodeShape)}
          link={(props) => renderLink(props as unknown as SankeyLinkShape)}
        >
          {withTooltip && (
            <Tooltip
              formatter={(value) => format(value) as React.ReactNode}
              {...getTooltipStyle(theme)}
            />
          )}
        </Sankey>
      </ChartFrame>
    )
  }
)

SankeyChartComponent.displayName = 'BolioUISankeyChart'
const SankeyChart = withScale(SankeyChartComponent)
export default SankeyChart
