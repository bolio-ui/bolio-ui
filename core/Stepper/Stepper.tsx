import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { StepperContext } from './StepperContext'

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
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const steps = React.Children.toArray(children).filter(React.isValidElement)
    const classes = useClasses('stepper', orientation, className)

    return (
      <ol ref={ref} className={classes} {...props}>
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
        <style jsx>{`
          .stepper {
            display: flex;
            box-sizing: border-box;
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
              ${SCALES.pl(0)};
            width: ${SCALES.width(1, 'auto')};
            font-size: ${SCALES.font(0.875)};
            color: ${theme.palette.foreground};
            list-style: none;
          }
          .vertical {
            flex-direction: column;
          }
        `}</style>
      </ol>
    )
  }
)

StepperComponent.displayName = 'BolioUIStepper'
const Stepper = withScale(StepperComponent)
export default Stepper
