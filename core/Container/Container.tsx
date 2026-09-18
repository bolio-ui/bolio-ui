import React, { useMemo } from 'react'
import useTheme from '../use-theme'

type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between'
type Align = 'top' | 'middle' | 'bottom'

interface Props {
  gap?: number
  justify?: Justify
  align?: Align
  component?: keyof React.JSX.IntrinsicElements
  className?: string
  fluid?: boolean
}

const defaultProps = {
  gap: 0,
  justify: 'start' as Justify,
  align: 'top' as Align,
  component: 'div' as keyof React.JSX.IntrinsicElements,
  className: '',
  fluid: false
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type ContainerProps = Props & NativeAttrs

const getFlexAlignment = (justify: Justify, align: Align) => {
  const flexJustifyMap: { [key in Justify]?: string } = {
    end: 'flex-end',
    center: 'center',
    'space-around': 'space-around',
    'space-between': 'space-between'
  }
  const flexAlignMap: { [key in Align]?: string } = {
    middle: 'center',
    bottom: 'flex-end'
  }
  return {
    justifyValue: flexJustifyMap[justify] || 'normal',
    alignValue: flexAlignMap[align] || 'normal'
  }
}

const Container = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<ContainerProps>
>(
  (
    {
      children,
      component = defaultProps.component,
      justify = defaultProps.justify,
      align = defaultProps.align,
      fluid = defaultProps.fluid,
      className = defaultProps.className,
      ...props
    },
    ref
  ) => {
    const Component = component as React.ElementType
    const theme = useTheme()

    const { justifyValue, alignValue } = useMemo(
      () => getFlexAlignment(justify, align),
      [justify, align]
    )

    const fluidWidth =
      !fluid && 'max-width: ' + theme.layout.pageWidthWithMargin

    return (
      <Component ref={ref} className={`container ${className}`} {...props}>
        {children}
        <style jsx>{`
          .container {
            /* width: 100%; */
            ${fluidWidth};
            padding-left: 15px;
            padding-right: 15px;
            margin-right: auto;
            margin-left: auto;
            justify-content: ${justifyValue};
            align-items: ${alignValue};
          }
        `}</style>
      </Component>
    )
  }
)

Container.displayName = 'BolioUIContainer'
export default Container
