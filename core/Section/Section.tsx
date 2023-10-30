import React from 'react'
import { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

export type SectionTypes = NormalTypes
interface Props {
  bg?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type SectionProps = Props & NativeAttrs

function SectionComponent({
  children,
  bg = 'transparent',
  className = '',
  ...props
}: React.PropsWithChildren<SectionProps>) {
  const { SCALES } = useScale()

  return (
    <section className={useClasses('section', className)} {...props}>
      {children}
      <style jsx>{`
        section {
          background-color: ${bg};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }
      `}</style>
    </section>
  )
}

SectionComponent.displayName = 'BolioUISection'
const Section = withScale(SectionComponent)
export default Section
