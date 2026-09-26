import React from 'react'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'

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
      ...props
    },
    ref
  ) => {
    const Component = component as React.ElementType

    return (
      <Component ref={ref} className={useClasses('col', className)} {...props}>
        {children}
        <style jsx>{`
          .col {
            box-sizing: border-box;
            padding-left: calc(var(--row-gap) / 2);
            padding-right: calc(var(--row-gap) / 2);
            width: ${(100 / 12) * span}%;
            margin-left: ${(100 / 12) * offset}%;
          }
        `}</style>
      </Component>
    )
  }
)

Col.displayName = 'BolioUICol'
export default Col
