import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import FieldsetTitle from './FieldsetTitle'
import FieldsetSubtitle from './FieldsetSubtitle'
import FieldsetFooter from './FieldsetFooter'
import FieldsetContent from './FieldsetContent'
import { hasChild, pickChild } from '../utils/collections'
import { useFieldset } from './FieldsetContext'
import useWarning from '../utils/use-warning'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  value?: string
  label?: string
  title?: string | ReactNode
  subtitle?: string | ReactNode
  className?: string
}

type NativeAttrs = Omit<React.FieldsetHTMLAttributes<any>, keyof Props>
export type FieldsetProps = Props & NativeAttrs

function FieldsetComponent({
  className = '',
  title = '' as string | ReactNode,
  subtitle = '' as string | ReactNode,
  children,
  value = '',
  label = '',
  ...props
}: React.PropsWithChildren<FieldsetProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const { inGroup, currentValue, register } = useFieldset()
  const [hidden, setHidden] = useState<boolean>(inGroup)
  const classes = useClasses('fieldset', className)

  const [withoutFooterChildren, FooterChildren] = pickChild(
    children,
    FieldsetFooter
  )

  const hasTitle = hasChild(withoutFooterChildren, FieldsetTitle)
  const hasSubtitle = hasChild(withoutFooterChildren, FieldsetSubtitle)
  const hasContent = hasChild(withoutFooterChildren, FieldsetContent)

  if (inGroup) {
    if (!label) {
      useWarning('Props "label" is required when in a group.', 'Fieldset Group')
    }
    if (!value || value === '') {
      value = label
    }

    useEffect(() => {
      register && register({ value, label })
    }, [])

    useEffect(() => {
      // In a few cases, the user will set Fieldset state manually.
      // If the user incorrectly set the state, Group component should ignore it.
      /* istanbul ignore if */
      if (!currentValue || currentValue === '') return
      setHidden(currentValue !== value)
    }, [currentValue, value])
  }

  const content = useMemo(
    () => (
      <>
        {withoutFooterChildren}
        {!hasTitle && title && <FieldsetTitle>{title}</FieldsetTitle>}
        {!hasSubtitle && subtitle && (
          <FieldsetSubtitle>{subtitle}</FieldsetSubtitle>
        )}
      </>
    ),
    [withoutFooterChildren, hasTitle, hasSubtitle, title, subtitle]
  )

  return (
    <div className={classes} {...props}>
      {hasContent ? content : <FieldsetContent>{content}</FieldsetContent>}
      {FooterChildren && FooterChildren}
      <style jsx>{`
        .fieldset {
          background-color: ${theme.palette.background};
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          overflow: hidden;
          display: ${hidden ? 'none' : 'block'};
          font-size: ${SCALES.font(1)};
          width: ${SCALES.width(1, 'auto')};
          height: ${SCALES.height(1, 'auto')};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }
      `}</style>
    </div>
  )
}

FieldsetComponent.displayName = 'BolioUIFieldset'
const Fieldset = withScale(FieldsetComponent)
export default Fieldset
