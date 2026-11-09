import React from 'react'
import { withScale } from '../use-scale'
import CartesianChart from './CartesianChart'
import type { ChartProps, ChartNativeAttrs, ChartCurve } from './CartesianChart'

interface CompositeChartExtra {
  curve?: ChartCurve
  withDots?: boolean
  connectNulls?: boolean
  withRightYAxis?: boolean
}

export type CompositeChartProps = ChartProps &
  CompositeChartExtra &
  ChartNativeAttrs

const CompositeChartComponent = React.forwardRef<
  HTMLDivElement,
  CompositeChartProps
>((props, ref) => <CartesianChart ref={ref} kind="composite" {...props} />)

CompositeChartComponent.displayName = 'BolioUICompositeChart'
const CompositeChart = withScale(CompositeChartComponent)
export default CompositeChart
