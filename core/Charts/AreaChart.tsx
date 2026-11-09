import React from 'react'
import { withScale } from '../use-scale'
import CartesianChart from './CartesianChart'
import type { ChartProps, ChartNativeAttrs, ChartCurve } from './CartesianChart'

interface AreaChartExtra {
  curve?: ChartCurve
  stacked?: boolean
  connectNulls?: boolean
}

export type AreaChartProps = ChartProps & AreaChartExtra & ChartNativeAttrs

const AreaChartComponent = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (props, ref) => <CartesianChart ref={ref} kind="area" {...props} />
)

AreaChartComponent.displayName = 'BolioUIAreaChart'
const AreaChart = withScale(AreaChartComponent)
export default AreaChart
