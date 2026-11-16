import React from 'react'
import useClasses from '../use-classes'

type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around'

interface Props {
  // space between the children, in rem
  gap?: number
  direction?: 'row' | 'column'
  wrap?: boolean
  align?: Align
  justify?: Justify
  inline?: boolean
  component?: keyof React.JSX.IntrinsicElements
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLElement>, keyof Props>
export type FlexProps = Props & NativeAttrs

const toFlex = (value?: string) =>
  value === 'start' || value === 'end' ? `flex-${value}` : value

const Flex = React.forwardRef<HTMLElement, React.PropsWithChildren<FlexProps>>(
  (
    {
      gap = 0,
      direction = 'row',
      wrap = false,
      align,
      justify,
      inline = false,
      component = 'div',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Component = component as React.ElementType
    return (
      <Component
        ref={ref}
        className={useClasses(className)}
        style={{
          display: inline ? 'inline-flex' : 'flex',
          flexDirection: direction,
          flexWrap: wrap ? 'wrap' : 'nowrap',
          alignItems: toFlex(align),
          justifyContent: toFlex(justify),
          gap: `${gap}rem`,
          ...style
        }}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Flex.displayName = 'BolioUIFlex'
export default Flex
