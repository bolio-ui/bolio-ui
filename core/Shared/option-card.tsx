import React from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import styles from './option-card.module.css'

// The frame shared by Radio.Card and Checkbox.Card.
const OptionCard: React.FC<
  React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>
> = ({ className = '', style, children }) => {
  const theme = useTheme()
  return (
    <div
      className={useClasses(styles.card, className)}
      style={
        {
          '--card-color': theme.palette.primary,
          '--card-border': theme.palette.border,
          '--card-hover-border': theme.palette.accents_4,
          '--card-bg': theme.palette.background,
          '--card-radius': theme.layout.radius,
          ...style
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

export default OptionCard
