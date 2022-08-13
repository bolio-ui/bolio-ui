import React from 'react'
import css from 'styled-jsx/css'
import SectionBasicItem, { SectionBasicItemProps } from './basic-item'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  className?: string
}

export type SectionProps = Props & SectionBasicItemProps

function SectionComponent({
  children,
  className = '',
  ...props
}: React.PropsWithChildren<SectionProps>) {
  const { SCALES } = useScale()

  const sectionGapUnit = 'var(--section-gap-unit)'

  const { className: resolveClassName, styles } = css.resolve`
    div {
      margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
      box-sizing: border-box;
      padding: ${SCALES.pt(0, sectionGapUnit)} ${SCALES.pr(0, sectionGapUnit)}
        ${SCALES.pb(0, sectionGapUnit)} ${SCALES.pl(0, sectionGapUnit)};
    }
  `
  const classes = useClasses(resolveClassName, className)

  return (
    <SectionBasicItem className={classes} {...props}>
      {children}
      {styles}
    </SectionBasicItem>
  )
}

SectionComponent.displayName = 'BolioUISection'
const Section = withScale(SectionComponent)
export default Section
