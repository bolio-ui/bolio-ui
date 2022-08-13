import React from 'react'
import { withScale } from '../use-scale'

interface Props {
  bg?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type SectionProps = Props & NativeAttrs

const SectionComponent: React.FC<SectionProps> = ({
  bg = '',
  className = '',
  children,
  ...props
}: React.PropsWithChildren<SectionProps>) => {
  return (
    <section className={className} {...props}>
      {children}
      <style jsx>{`
        section {
          background-color: ${bg ? bg : 'transparent'};
        }
      `}</style>
    </section>
  )
}

SectionComponent.displayName = 'BolioUISection'
const Section = withScale(SectionComponent)
export default Section
