import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { StepperContext } from './StepperContext'
import styles from './Stepper.module.css'

export type StepperOrientation = 'horizontal' | 'vertical'

interface Props {
  // index of the current step; the ones before it are completed
  active: number
  // turns the steps into buttons
  onStepClick?: (index: number) => void
  orientation?: StepperOrientation
  className?: string
}

type NativeAttrs = Omit<React.OlHTMLAttributes<HTMLOListElement>, keyof Props>
export type StepperProps = Props & NativeAttrs

const StepperComponent = React.forwardRef<
  HTMLOListElement,
  React.PropsWithChildren<StepperProps>
>(
  (
    {
      active,
      onStepClick,
      orientation = 'horizontal',
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const steps = React.Children.toArray(children).filter(React.isValidElement)
    const classes = useClasses(styles.stepper, styles[orientation], className)

    const stepperStyle: React.CSSProperties = {
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      width: SCALES.width(1, 'auto'),
      fontSize: SCALES.font(0.875),
      color: theme.palette.foreground,
      ...style
    }

    return (
      <ol ref={ref} className={classes} {...props} style={stepperStyle}>
        {steps.map((step, index) => (
          <StepperContext.Provider
            key={step.key ?? index}
            value={{
              index,
              active,
              isLast: index === steps.length - 1,
              orientation,
              onStepClick
            }}
          >
            {step}
          </StepperContext.Provider>
        ))}
      </ol>
    )
  }
)

StepperComponent.displayName = 'BolioUIStepper'
const Stepper = withScale(StepperComponent)
export default Stepper
