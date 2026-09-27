import React, { useContext } from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import { StepperContext } from './StepperContext'
import styles from './StepperStep.module.css'

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
      styles.step,
      state,
      styles[orientation],
      { [styles.error]: error, [styles.last]: isLast },
      className
    )
    // the state that the color shows, in words for screen readers
    const status = error ? 'Error' : state === 'completed' ? 'Completed' : ''

    let indicatorStyle: React.CSSProperties = {
      color: theme.palette.accents_5,
      border: `1px solid ${theme.palette.border}`,
      backgroundColor: theme.palette.background
    }
    if (state === 'current') {
      indicatorStyle = {
        ...indicatorStyle,
        color: theme.palette.primary,
        border: `2px solid ${theme.palette.primary}`
      }
    }
    if (state === 'completed') {
      indicatorStyle = {
        ...indicatorStyle,
        color: theme.palette.background,
        backgroundColor: theme.palette.primary,
        border: `1px solid ${theme.palette.primary}`
      }
    }
    if (error) {
      indicatorStyle = {
        ...indicatorStyle,
        color: theme.palette.background,
        backgroundColor: theme.palette.error,
        border: `1px solid ${theme.palette.error}`
      }
    }

    let labelStyle: React.CSSProperties | undefined
    if (state === 'upcoming') labelStyle = { color: theme.palette.accents_5 }
    if (error) labelStyle = { color: theme.palette.error }

    const connectorStyle: React.CSSProperties = {
      backgroundColor:
        state === 'completed' ? theme.palette.primary : theme.palette.border
    }

    const content = (
      <>
        <span
          className={styles.indicator}
          style={indicatorStyle}
          aria-hidden="true"
        >
          {icon ??
            (error ? '!' : state === 'completed' ? <Check /> : index + 1)}
        </span>
        <span className={styles.text}>
          <span className={styles.label} style={labelStyle}>
            {label}
          </span>
          {description && (
            <span
              className={styles.description}
              style={{ color: theme.palette.accents_5 }}
            >
              {description}
            </span>
          )}
          {status && <span className={styles.srOnly}>, {status}</span>}
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
            className={styles.head}
            disabled={disabled}
            style={
              {
                borderRadius: theme.layout.radius,
                '--stepper-focus-color': theme.palette.primary
              } as React.CSSProperties
            }
            onClick={() => onStepClick(index)}
          >
            {content}
          </button>
        ) : (
          <div
            className={styles.head}
            style={{ borderRadius: theme.layout.radius }}
          >
            {content}
          </div>
        )}
        {!isLast && (
          <span
            className={styles.connector}
            style={connectorStyle}
            aria-hidden="true"
          />
        )}
      </li>
    )
  }
)

StepperStep.displayName = 'BolioUIStepperStep'
export default StepperStep
