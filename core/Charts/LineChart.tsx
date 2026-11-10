import React from 'react'
import { withScale } from '../use-scale'
import CartesianChart from './CartesianChart'
import type { ChartProps, ChartNativeAttrs, ChartCurve } from './CartesianChart'

interface LineChartExtra {
  curve?: ChartCurve
  withDots?: boolean
  connectNulls?: boolean
}

export type LineChartProps = ChartProps & LineChartExtra & ChartNativeAttrs

const LineChartComponent = React.forwardRef<HTMLDivElement, LineChartProps>(
  (props, ref) => <CartesianChart ref={ref} kind="line" {...props} />
)

LineChartComponent.displayName = 'BolioUILineChart'
const LineChart = withScale(LineChartComponent)
export default LineChart
