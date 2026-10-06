import React from 'react'
import GridBasicItem, { GridBasicItemProps } from './BasicItem'
import useScale, { withScale } from '../use-scale'

interface Props {
  className?: string
}

export type GridProps = Props & GridBasicItemProps

const GridComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<GridProps>
>(({ children, className = '', style, ...props }, ref) => {
  const { SCALES } = useScale()

  const gridGapUnit = 'var(--grid-gap-unit)'

  const gridStyle: React.CSSProperties = {
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    boxSizing: 'border-box',
    padding: `${SCALES.pt(0, gridGapUnit)} ${SCALES.pr(0, gridGapUnit)} ${SCALES.pb(0, gridGapUnit)} ${SCALES.pl(0, gridGapUnit)}`,
    ...style
  }

  return (
    <GridBasicItem ref={ref} className={className} style={gridStyle} {...props}>
      {children}
    </GridBasicItem>
  )
})

GridComponent.displayName = 'BolioUIGrid'
const Grid = withScale(GridComponent)
export default Grid
