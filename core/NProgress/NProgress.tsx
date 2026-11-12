import React from 'react'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import styles from './NProgress.module.css'

interface Props {
  // 0 to 100
  value: number
  visible?: boolean
  // pixels
  height?: number
  color?: string
  zIndex?: number
  label?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type NProgressProps = Props & NativeAttrs

const NProgress = React.forwardRef<HTMLDivElement, NProgressProps>(
  (
    {
      value,
      visible = true,
      height = 3,
      color,
      zIndex = 1200,
      label = 'Page loading',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const reduced = useReducedMotion()
    const bar = color || theme.palette.primary
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-hidden={!visible || undefined}
        className={`${styles.root} ${className}`.trim()}
        style={{
          height,
          zIndex,
          opacity: visible ? 1 : 0,
          transition: reduced ? 'none' : 'opacity 0.25s ease',
          ...style
        }}
        {...props}
      >
        <div
          className={styles.bar}
          style={{
            width: `${value}%`,
            backgroundColor: bar,
            boxShadow: `0 0 8px ${bar}`,
            transition: reduced ? 'none' : 'width 0.2s ease'
          }}
        />
      </div>
    )
  }
)

NProgress.displayName = 'BolioUINProgress'
export default NProgress
