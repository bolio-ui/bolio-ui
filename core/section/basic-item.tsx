import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import {
  SectionJustify,
  SectionDirection,
  SectionAlignItems,
  SectionAlignContent
} from './section-types'
import useScale from '../use-scale'
import useClasses from '../use-classes'

export type SectionBreakpointsValue = number | boolean

export interface SectionBasicComponentProps {
  bg?: string
  xs?: SectionBreakpointsValue
  sm?: SectionBreakpointsValue
  md?: SectionBreakpointsValue
  lg?: SectionBreakpointsValue
  xl?: SectionBreakpointsValue
  justify?: SectionJustify
  direction?: SectionDirection
  alignItems?: SectionAlignItems
  alignContent?: SectionAlignContent
  className?: string
}

const defaultProps = {
  xs: false as SectionBreakpointsValue,
  sm: false as SectionBreakpointsValue,
  md: false as SectionBreakpointsValue,
  lg: false as SectionBreakpointsValue,
  xl: false as SectionBreakpointsValue,
  className: ''
}

type NativeAttrs = Omit<
  React.HTMLAttributes<unknown>,
  keyof SectionBasicComponentProps
>
export type SectionBasicItemProps = SectionBasicComponentProps & NativeAttrs

type ItemLayoutValue = {
  grow: number
  width: string
  basis: string
  display: string
}

const getItemLayout = (val: SectionBreakpointsValue): ItemLayoutValue => {
  const display = val === 0 ? 'display: none;' : 'display: inherit;'
  if (typeof val === 'number') {
    const width = (100 / 24) * val
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

function SectionBasicItem({
  bg,
  xs,
  sm,
  md,
  lg,
  xl,
  justify,
  direction,
  alignItems,
  alignContent,
  children,
  className,
  ...props
}: React.PropsWithChildren<SectionBasicItemProps> & typeof defaultProps) {
  const theme = useTheme()
  const { SCALES } = useScale()
  const classes = useMemo(() => {
    const aligns: { [key: string]: any } = {
      justify,
      direction,
      alignItems,
      alignContent,
      xs,
      sm,
      md,
      lg,
      xl
    }
    const classString = Object.keys(aligns).reduce((pre, name) => {
      if (aligns[name] !== undefined && aligns[name] !== false)
        return `${pre} ${name}`
      return pre
    }, '')
    return classString.trim()
  }, [justify, direction, alignItems, alignContent, xs, sm, md, lg, xl])

  const layout = useMemo<
    {
      [key in ['xs', 'sm', 'md', 'lg', 'xl'][number]]: ItemLayoutValue
    }
  >(
    () => ({
      xs: getItemLayout(xs),
      sm: getItemLayout(sm),
      md: getItemLayout(md),
      lg: getItemLayout(lg),
      xl: getItemLayout(xl)
    }),
    [xs, sm, md, lg, xl]
  )

  return (
    <div className={useClasses('item', classes, className)} {...props}>
      {children}
      <style jsx>{`
        .item {
          background-color: ${bg ? bg : 'transparent'};
          font-size: ${SCALES.font(1, 'inherit')};
          height: ${SCALES.height(1, 'auto')};
        }
        .justify {
          justify-content: ${justify};
        }
        .direction {
          flex-direction: ${direction};
        }
        .alignContent {
          align-content: ${alignContent};
        }
        .alignItems {
          align-items: ${alignItems};
        }
        .xs {
          flex-grow: ${layout.xs.grow};
          max-width: ${layout.xs.width};
          flex-basis: ${layout.xs.basis};
          ${layout.xs.display}
        }
        @media only screen and (min-width: ${theme.breakpoints.sm.min}) {
          .sm {
            flex-grow: ${layout.sm.grow};
            max-width: ${layout.sm.width};
            flex-basis: ${layout.sm.basis};
            ${layout.sm.display}
          }
        }
        @media only screen and (min-width: ${theme.breakpoints.md.min}) {
          .md {
            flex-grow: ${layout.md.grow};
            max-width: ${layout.md.width};
            flex-basis: ${layout.md.basis};
            ${layout.md.display}
          }
        }
        @media only screen and (min-width: ${theme.breakpoints.lg.min}) {
          .lg {
            flex-grow: ${layout.lg.grow};
            max-width: ${layout.lg.width};
            flex-basis: ${layout.lg.basis};
            ${layout.lg.display}
          }
        }
        @media only screen and (min-width: ${theme.breakpoints.xl.min}) {
          .xl {
            flex-grow: ${layout.xl.grow};
            max-width: ${layout.xl.width};
            flex-basis: ${layout.xl.basis};
            ${layout.xl.display}
          }
        }
      `}</style>
    </div>
  )
}

SectionBasicItem.defaultProps = defaultProps
SectionBasicItem.displayName = 'BolioUISectionBasicItem'
export default SectionBasicItem
