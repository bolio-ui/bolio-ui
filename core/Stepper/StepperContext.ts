import React from 'react'
import type { StepperOrientation } from './Stepper'

export interface StepperConfig {
  index: number
  active: number
  isLast: boolean
  orientation: StepperOrientation
  onStepClick?: (index: number) => void
}

export const StepperContext = React.createContext<StepperConfig>({
  index: 0,
  active: 0,
  isLast: true,
  orientation: 'horizontal'
})
