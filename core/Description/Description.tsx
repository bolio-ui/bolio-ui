import React, { ReactNode } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Description.module.css'

interface Props {
  title?: ReactNode | string
  content?: ReactNode | string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type DescriptionProps = Props & NativeAttrs

const DescriptionComponent = React.forwardRef<
  HTMLDListElement,
  React.PropsWithChildren<DescriptionProps>
>(
  (
    {
      title = 'Title' as ReactNode | string,
      content = '' as ReactNode | string,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const classes = useClasses(styles.description, className)

    const descriptionStyle: React.CSSProperties = {
      fontSize: SCALES.font(1),
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <dl ref={ref} className={classes} {...props} style={descriptionStyle}>
        <dt style={{ color: theme.palette.accents_5 }}>{title}</dt>
        <dd style={{ color: theme.palette.foreground }}>{content}</dd>
      </dl>
    )
  }
)

DescriptionComponent.displayName = 'BolioUIDescription'
const Description = withScale(DescriptionComponent)
export default Description
