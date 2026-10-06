import React, { useMemo } from 'react'
import GridBasicItem, { GridBasicItemProps } from './BasicItem'
import { GridWrap } from './GridTypes'
import useScale, { withScale } from '../use-scale'

interface Props {
  gap?: number
  wrap?: GridWrap
  className?: string
}

export type GridContainerProps = Props & GridBasicItemProps

const GridContainerComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<GridContainerProps>
>(
  (
    {
      gap = 0,
      wrap = 'wrap' as GridWrap,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const { unit, SCALES } = useScale()
    const gapUnit = useMemo(() => `calc(${gap} * ${unit} * 1/3)`, [gap, unit])

    const containerStyle = {
      '--grid-gap-unit': gapUnit,
      display: 'flex',
      flexWrap: wrap,
      boxSizing: 'border-box',
      width: SCALES.width(1, '100%'),
      ...style
    } as React.CSSProperties

    return (
      <GridBasicItem
        ref={ref}
        className={className}
        style={containerStyle}
        {...props}
      >
        {children}
      </GridBasicItem>
    )
  }
)

GridContainerComponent.displayName = 'BolioUIGridContainer'
const GridContainer = withScale(GridContainerComponent)
export default GridContainer
