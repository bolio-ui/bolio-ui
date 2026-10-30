import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import { addColorAlpha } from '../utils/color'
import styles from './Mark.module.css'

interface Props {
  // the text to search in
  children?: string
  // the terms to mark, matched without regard to case
  highlight?: string | string[]
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLSpanElement>, keyof Props>
export type MarkProps = Props & NativeAttrs

const escapeRegExp = (term: string) =>
  term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const MarkComponent = React.forwardRef<HTMLSpanElement, MarkProps>(
  ({ children = '', highlight = '', className = '', style, ...props }, ref) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    // splitting on a capturing group puts every match at an odd index
    const parts = useMemo(() => {
      const terms = ([] as string[]).concat(highlight).filter(Boolean)
      if (!terms.length) return [children]
      const pattern = terms
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExp)
        .join('|')
      return children.split(new RegExp(`(${pattern})`, 'i'))
    }, [children, highlight])

    const markStyle = {
      fontSize: SCALES.font(1),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--mark-bg': addColorAlpha(theme.palette.warning, 0.4),
      ...style
    } as React.CSSProperties

    return (
      <span ref={ref} className={className} {...props} style={markStyle}>
        {parts.map((part, index) =>
          index % 2 ? (
            <mark key={index} className={styles.mark}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    )
  }
)

MarkComponent.displayName = 'BolioUIMark'
const Mark = withScale(MarkComponent)
export default Mark
