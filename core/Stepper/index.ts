import Stepper from './Stepper'
import StepperStep from './StepperStep'

export type StepperComponentType = typeof Stepper & {
  Step: typeof StepperStep
}
;(Stepper as StepperComponentType).Step = StepperStep

export type { StepperProps, StepperOrientation } from './Stepper'
export type { StepperStepProps } from './StepperStep'
export default Stepper as StepperComponentType
