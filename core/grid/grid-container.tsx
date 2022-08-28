import React, { useMemo } from 'react'
import GridBasicItem, { GridBasicItemProps } from './basic-item'
import { GridWrap } from './grid-types'
import css from 'styled-jsx/css'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  gap?: number
  wrap?: GridWrap
  className?: string
}

export type GridContainerProps = Props & GridBasicItemProps

function GridContainerComponent({
  gap = 0,
  wrap = 'wrap' as GridWrap,
  children,
  className = '',
  ...props
}: React.PropsWithChildren<GridContainerProps>) {
  const { unit, SCALES } = useScale()
  const gapUnit = useMemo(() => `calc(${gap} * ${unit} * 1/3)`, [gap, unit])

  const gridConMargin = 'calc(-1 * var(--grid-gap-unit))'
  const gridConWidth = 'calc(100% + var(--grid-gap-unit) * 2)'

  const { className: resolveClassName, styles } = css.resolve`
    div {
      --grid-gap-unit: ${gapUnit};
      --grid-container-margin: ${gridConMargin};
      --grid-container-width: ${gridConWidth};
      display: flex;
      flex-wrap: ${wrap};
      box-sizing: border-box;
      width: ${SCALES.width(1, gridConWidth)};
      margin: ${SCALES.mt(0, gridConMargin)} ${SCALES.mr(0, gridConMargin)}
        ${SCALES.mb(0, gridConMargin)} ${SCALES.ml(0, gridConMargin)};
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

GridContainerComponent.displayName = 'BolioUIGridContainer'
const GridContainer = withScale(GridContainerComponent)
export default GridContainer
