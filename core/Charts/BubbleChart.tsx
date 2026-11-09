import React from 'react'
import { withScale } from '../use-scale'
import ScatterBase from './ScatterBase'
import type { ScatterBaseProps } from './ScatterBase'

export type BubbleChartProps = Omit<ScatterBaseProps, 'sizeRange'> & {
  // the area of the smallest and the biggest bubble, in square pixels
  sizeRange?: [number, number]
}

const BubbleChartComponent = React.forwardRef<HTMLDivElement, BubbleChartProps>(
  ({ sizeRange = [40, 600], ...props }, ref) => (
    <ScatterBase ref={ref} sizeRange={sizeRange} {...props} />
  )
)

BubbleChartComponent.displayName = 'BolioUIBubbleChart'
const BubbleChart = withScale(BubbleChartComponent)
export default BubbleChart
