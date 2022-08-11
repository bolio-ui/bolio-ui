import React from 'react'

interface Props {
  span?: number
  offset?: number
  component?: keyof JSX.IntrinsicElements
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type ColProps = Props & NativeAttrs

function Col({
  component = 'div' as keyof JSX.IntrinsicElements,
  children,
  span = 24,
  offset = 0,
  className = '',
  ...props
}: React.PropsWithChildren<ColProps>) {
  const Component = component

  return (
    <Component className={`col ${className}`} {...props}>
      {children}
      <style jsx>{`
        .col {
          float: left;
          box-sizing: border-box;
          padding-left: calc(var(--row-gap) / 2);
          padding-right: calc(var(--row-gap) / 2);
          width: ${(100 / 24) * span}%;
          margin-left: ${(100 / 24) * offset}%;
        }
      `}</style>
    </Component>
  )
}

Col.displayName = 'BolioUICol'
export default Col
