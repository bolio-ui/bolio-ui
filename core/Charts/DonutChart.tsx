import React from 'react'
import { withScale } from '../use-scale'
import RadialChart from './RadialChart'
import type { RadialChartProps, RadialChartNativeAttrs } from './RadialChart'

interface DonutChartExtra {
  thickness?: number
  chartLabel?: string | number
}

export type DonutChartProps = RadialChartProps &
  DonutChartExtra &
  RadialChartNativeAttrs

const DonutChartComponent = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (props, ref) => <RadialChart ref={ref} donut {...props} />
)

DonutChartComponent.displayName = 'BolioUIDonutChart'
const DonutChart = withScale(DonutChartComponent)
export default DonutChart
