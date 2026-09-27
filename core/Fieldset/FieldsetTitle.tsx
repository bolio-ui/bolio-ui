import React from 'react'
import useClasses from '../use-classes'
import styles from './FieldsetTitle.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type FieldsetTitleProps = Props & NativeAttrs

function FieldsetTitle({
  className = '',
  children,
  ...props
}: React.PropsWithChildren<FieldsetTitleProps>) {
  const classes = useClasses('title', styles.title, className)

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

FieldsetTitle.displayName = 'BolioUIFieldsetTitle'
export default FieldsetTitle
