import React from 'react'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Col.module.css'

interface Props {
  span?: number
  offset?: number
  component?: keyof React.JSX.IntrinsicElements
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type ColProps = Props & NativeAttrs

const Col = React.forwardRef<HTMLElement, React.PropsWithChildren<ColProps>>(
  (
    {
      component = 'div' as keyof React.JSX.IntrinsicElements,
      children,
      span = 12,
      offset = 0,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const Component = component as React.ElementType

    const colStyle = {
      width: `${(100 / 12) * span}%`,
      marginLeft: `${(100 / 12) * offset}%`,
      ...style
    } as React.CSSProperties

    return (
      <Component
        ref={ref}
        className={useClasses('col', styles.col, className)}
        {...props}
        style={colStyle}
      >
        {children}
      </Component>
    )
  }
)

Col.displayName = 'BolioUICol'
export default Col
