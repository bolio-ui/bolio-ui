import React from 'react'
import { withScale } from '../use-scale'
import ScatterBase from './ScatterBase'
import type { ScatterBaseProps } from './ScatterBase'

export type { ScatterSeries } from './ScatterBase'
export type ScatterChartProps = Omit<ScatterBaseProps, 'sizeRange' | 'zLabel'>

const ScatterChartComponent = React.forwardRef<
  HTMLDivElement,
  ScatterChartProps
>((props, ref) => <ScatterBase ref={ref} {...props} />)

ScatterChartComponent.displayName = 'BolioUIScatterChart'
const ScatterChart = withScale(ScatterChartComponent)
export default ScatterChart
