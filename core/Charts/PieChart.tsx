import React from 'react'
import { withScale } from '../use-scale'
import RadialChart from './RadialChart'
import type { RadialChartProps, RadialChartNativeAttrs } from './RadialChart'

export type PieChartProps = RadialChartProps & RadialChartNativeAttrs

const PieChartComponent = React.forwardRef<HTMLDivElement, PieChartProps>(
  (props, ref) => <RadialChart ref={ref} {...props} />
)

PieChartComponent.displayName = 'BolioUIPieChart'
const PieChart = withScale(PieChartComponent)
export default PieChart
