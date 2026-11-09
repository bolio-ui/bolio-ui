import React from 'react'
import { withScale } from '../use-scale'
import CartesianChart from './CartesianChart'
import type { ChartProps, ChartNativeAttrs } from './CartesianChart'

interface BarChartExtra {
  stacked?: boolean
}

export type BarChartProps = ChartProps & BarChartExtra & ChartNativeAttrs

const BarChartComponent = React.forwardRef<HTMLDivElement, BarChartProps>(
  (props, ref) => <CartesianChart ref={ref} kind="bar" {...props} />
)

BarChartComponent.displayName = 'BolioUIBarChart'
const BarChart = withScale(BarChartComponent)
export default BarChart
