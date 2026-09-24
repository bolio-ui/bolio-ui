import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'

type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between'
type Align = 'top' | 'middle' | 'bottom'

interface Props {
  gap?: number
  justify?: Justify
  align?: Align
  component?: keyof React.JSX.IntrinsicElements
  className?: string
}

const defaultProps = {
  gap: 0,
  justify: 'start' as Justify,
  align: 'top' as Align,
  component: 'div' as keyof React.JSX.IntrinsicElements,
  className: ''
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type RowProps = Props & NativeAttrs

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

const Row = React.forwardRef<HTMLElement, React.PropsWithChildren<RowProps>>(
  (
    {
      children,
      component = defaultProps.component,
      gap = defaultProps.gap,
      justify = defaultProps.justify,
      align = defaultProps.align,
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

    return (
      <Component ref={ref} className={useClasses('row', className)} {...props}>
        {children}
        <style jsx>{`
          .row {
            display: flex;
            position: relative;
            box-sizing: border-box;
            margin-left: calc(${gap} * ${theme.layout.gap} / 2);
            margin-right: calc(${gap} * ${theme.layout.gap} / 2);
            --row-gap: calc(${gap} * ${theme.layout.gap});
            justify-content: ${justifyValue};
            align-items: ${alignValue};
          }
        `}</style>
      </Component>
    )
  }
)

Row.displayName = 'BolioUIRow'
export default Row
