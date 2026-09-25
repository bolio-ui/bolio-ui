import React, { useContext } from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import { StepperContext } from './StepperContext'

interface Props {
  label: React.ReactNode
  description?: React.ReactNode
  // replaces the number, the check and the error mark
  icon?: React.ReactNode
  error?: boolean
  // only matters when the Stepper has onStepClick
  disabled?: boolean
  className?: string
}

type NativeAttrs = Omit<React.LiHTMLAttributes<HTMLLIElement>, keyof Props>
export type StepperStepProps = Props & NativeAttrs

const Check = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path
      d="M20 6 9 17l-5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const StepperStep = React.forwardRef<HTMLLIElement, StepperStepProps>(
  (
    {
      label,
      description,
      icon,
      error = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { index, active, isLast, orientation, onStepClick } =
      useContext(StepperContext)
    const state =
      index < active ? 'completed' : index === active ? 'current' : 'upcoming'
    const classes = useClasses(
      'step',
      state,
      orientation,
      { error, last: isLast },
      className
    )
    // the state that the color shows, in words for screen readers
    const status = error ? 'Error' : state === 'completed' ? 'Completed' : ''

    const content = (
      <>
        <span className="indicator" aria-hidden="true">
          {icon ??
            (error ? '!' : state === 'completed' ? <Check /> : index + 1)}
        </span>
        <span className="text">
          <span className="label">{label}</span>
          {description && <span className="description">{description}</span>}
          {status && <span className="sr-only">, {status}</span>}
        </span>
      </>
    )

    return (
      <li
        ref={ref}
        className={classes}
        aria-current={state === 'current' ? 'step' : undefined}
        {...props}
      >
        {onStepClick ? (
          <button
            type="button"
            className="head"
            disabled={disabled}
            onClick={() => onStepClick(index)}
          >
            {content}
          </button>
        ) : (
          <div className="head">{content}</div>
        )}
        {!isLast && <span className="connector" aria-hidden="true" />}
        <style jsx>{`
          .step {
            display: flex;
            flex: 1;
            align-items: center;
            min-width: 0;
          }
          .step.last {
            flex: 0 0 auto;
          }
          .step.vertical {
            flex-direction: column;
            align-items: flex-start;
          }
          .head {
            display: flex;
            align-items: center;
            gap: 0.75em;
            margin: 0;
            padding: 0;
            font: inherit;
            text-align: left;
            color: inherit;
            background: none;
            border: 0;
            border-radius: ${theme.layout.radius};
          }
          button.head {
            cursor: pointer;
          }
          button.head:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
          button.head:focus-visible {
            outline: 2px solid ${theme.palette.primary};
            outline-offset: 2px;
          }
          .indicator {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: 2em;
            height: 2em;
            font-weight: 600;
            border-radius: 50%;
            color: ${theme.palette.accents_5};
            border: 1px solid ${theme.palette.border};
            background-color: ${theme.palette.background};
            transition:
              background-color 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease;
          }
          .current .indicator {
            color: ${theme.palette.primary};
            border: 2px solid ${theme.palette.primary};
          }
          .completed .indicator {
            color: ${theme.palette.background};
            background-color: ${theme.palette.primary};
            border-color: ${theme.palette.primary};
          }
          .error .indicator {
            color: ${theme.palette.background};
            background-color: ${theme.palette.error};
            border-color: ${theme.palette.error};
          }
          .text {
            display: flex;
            flex-direction: column;
            line-height: 1.3em;
          }
          .label {
            font-weight: 500;
            white-space: nowrap;
          }
          .upcoming .label {
            color: ${theme.palette.accents_5};
          }
          .error .label {
            color: ${theme.palette.error};
          }
          .description {
            font-size: 0.875em;
            color: ${theme.palette.accents_5};
          }
          .connector {
            flex: 1;
            height: 2px;
            min-width: 1.5em;
            margin: 0 0.75em;
            background-color: ${theme.palette.border};
          }
          .completed .connector {
            background-color: ${theme.palette.primary};
          }
          .vertical .connector {
            flex: none;
            width: 2px;
            height: auto;
            min-width: 0;
            min-height: 1.5em;
            margin: 0.25em 0 0.25em calc(1em - 1px);
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
            border: 0;
          }
        `}</style>
      </li>
    )
  }
)

StepperStep.displayName = 'BolioUIStepperStep'
export default StepperStep
