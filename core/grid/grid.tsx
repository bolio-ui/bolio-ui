import React from 'react'
import css from 'styled-jsx/css'
import GridBasicItem, { GridBasicItemProps } from './basic-item'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  className?: string
}

export type GridProps = Props & GridBasicItemProps

function GridComponent({
  children,
  className = '',
  ...props
}: React.PropsWithChildren<GridProps>) {
  const { SCALES } = useScale()

  const gridGapUnit = 'var(--grid-gap-unit)'

  const { className: resolveClassName, styles } = css.resolve`
    div {
      margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
      box-sizing: border-box;
      padding: ${SCALES.pt(0, gridGapUnit)} ${SCALES.pr(0, gridGapUnit)}
        ${SCALES.pb(0, gridGapUnit)} ${SCALES.pl(0, gridGapUnit)};
    }
  `
  const classes = useClasses(resolveClassName, className)

  return (
    <GridBasicItem className={classes} {...props}>
      {children}
      {styles}
    </GridBasicItem>
  )
}

GridComponent.displayName = 'BolioUIGrid'
const Grid = withScale(GridComponent)
export default Grid
