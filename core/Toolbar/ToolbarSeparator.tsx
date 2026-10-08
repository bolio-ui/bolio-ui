import React from 'react'
import useClasses from '../use-classes'
import styles from './Toolbar.module.css'

export type ToolbarSeparatorProps = React.HTMLAttributes<HTMLDivElement>

const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  ToolbarSeparatorProps
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={useClasses(styles.separator, className)}
    {...props}
  />
))

ToolbarSeparator.displayName = 'BolioUIToolbarSeparator'
export default ToolbarSeparator
