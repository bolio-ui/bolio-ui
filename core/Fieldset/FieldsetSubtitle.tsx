import React from 'react'
import styles from './FieldsetSubtitle.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type FieldsetSubtitleProps = Props & NativeAttrs

function FieldsetSubtitle({
  className = '',
  children,
  ...props
}: React.PropsWithChildren<FieldsetSubtitleProps>) {
  return (
    <div className={`${styles.subtitle} ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

FieldsetSubtitle.displayName = 'BolioUIFieldsetSubtitle'
export default FieldsetSubtitle
