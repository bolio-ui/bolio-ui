import React, { useMemo } from 'react'
import {
  GridJustify,
  GridDirection,
  GridAlignItems,
  GridAlignContent
} from './GridTypes'
import useScale from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './BasicItem.module.css'

export type GridBreakpointsValue = number | boolean
export interface GridBasicComponentProps {
  xs?: GridBreakpointsValue
  sm?: GridBreakpointsValue
  md?: GridBreakpointsValue
  lg?: GridBreakpointsValue
  xl?: GridBreakpointsValue
  justify?: GridJustify
  direction?: GridDirection
  alignItems?: GridAlignItems
  alignContent?: GridAlignContent
  className?: string
}

const defaultProps = {
  xs: false as GridBreakpointsValue,
  sm: false as GridBreakpointsValue,
  md: false as GridBreakpointsValue,
  lg: false as GridBreakpointsValue,
  xl: false as GridBreakpointsValue,
  className: ''
}

type NativeAttrs = Omit<
  React.HTMLAttributes<AnyElement>,
  keyof GridBasicComponentProps
>
export type GridBasicItemProps = GridBasicComponentProps & NativeAttrs

type ItemLayoutValue = {
  grow: number
  width: string
  basis: string
  display: string
}
const getItemLayout = (val: GridBreakpointsValue): ItemLayoutValue => {
  const display = val === 0 ? 'none' : 'block'
  if (typeof val === 'number') {
    const width = (100 / 12) * val
    const ratio = width > 100 ? '100%' : width < 0 ? '0' : `${width}%`
    return {
      grow: 0,
      display,
      width: ratio,
      basis: ratio
    }
  }
  return {
    grow: 1,
    display,
    width: '100%',
    basis: '0'
  }
}

const GridBasicItem = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<GridBasicItemProps>
>(
  (
    {
      xs = defaultProps.xs,
      sm = defaultProps.sm,
      md = defaultProps.md,
      lg = defaultProps.lg,
      xl = defaultProps.xl,
      justify,
      direction,
      alignItems,
      alignContent,
      children,
      className = defaultProps.className,
      style,
      ...props
    },
    ref
  ) => {
    const { SCALES } = useScale()
    const classes = useMemo(() => {
      const aligns: { [key: string]: unknown } = {
        [styles.justify]: justify,
        [styles.direction]: direction,
        [styles.alignItems]: alignItems,
        [styles.alignContent]: alignContent,
        [styles.xs]: xs,
        [styles.sm]: sm,
        [styles.md]: md,
        [styles.lg]: lg,
        [styles.xl]: xl
      }
      const classString = Object.keys(aligns).reduce((pre, name) => {
        if (aligns[name] !== undefined && aligns[name] !== false)
          return `${pre} ${name}`
        return pre
      }, '')
      return useClasses(styles.item, classString, className)
    }, [
      justify,
      direction,
      alignItems,
      alignContent,
      xs,
      sm,
      md,
      lg,
      xl,
      className
    ])

    const layout = useMemo<{
      [key in ['xs', 'sm', 'md', 'lg', 'xl'][number]]: ItemLayoutValue
    }>(
      () => ({
        xs: getItemLayout(xs),
        sm: getItemLayout(sm),
        md: getItemLayout(md),
        lg: getItemLayout(lg),
        xl: getItemLayout(xl)
      }),
      [xs, sm, md, lg, xl]
    )

    const itemStyle = {
      '--grid-font-size': SCALES.font(1, 'inherit'),
      '--grid-height': SCALES.height(1, 'auto'),
      '--grid-justify': justify,
      '--grid-direction': direction,
      '--grid-align-content': alignContent,
      '--grid-align-items': alignItems,
      '--grid-xs-grow': layout.xs.grow,
      '--grid-xs-max-width': layout.xs.width,
      '--grid-xs-basis': layout.xs.basis,
      '--grid-xs-display': layout.xs.display,
      '--grid-sm-grow': layout.sm.grow,
      '--grid-sm-max-width': layout.sm.width,
      '--grid-sm-basis': layout.sm.basis,
      '--grid-sm-display': layout.sm.display,
      '--grid-md-grow': layout.md.grow,
      '--grid-md-max-width': layout.md.width,
      '--grid-md-basis': layout.md.basis,
      '--grid-md-display': layout.md.display,
      '--grid-lg-grow': layout.lg.grow,
      '--grid-lg-max-width': layout.lg.width,
      '--grid-lg-basis': layout.lg.basis,
      '--grid-lg-display': layout.lg.display,
      '--grid-xl-grow': layout.xl.grow,
      '--grid-xl-max-width': layout.xl.width,
      '--grid-xl-basis': layout.xl.basis,
      '--grid-xl-display': layout.xl.display,
      ...style
    } as React.CSSProperties

    return (
      <div ref={ref} className={classes} {...props} style={itemStyle}>
        {children}
      </div>
    )
  }
)

GridBasicItem.displayName = 'BolioUIGridBasicItem'
export default GridBasicItem
