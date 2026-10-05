import React from 'react'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './ButtonIcon.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type ButtonIconProps = Props & NativeAttrs

function ButtonIcon({ children, className = '', ...props }: ButtonIconProps) {
  const classes = useClasses(styles.icon, className)

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}

ButtonIcon.displayName = 'BolioUIButtonIcon'
export default ButtonIcon
