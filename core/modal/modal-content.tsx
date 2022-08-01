import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLElement>, keyof Props>
export type ModalContentProps = Props & NativeAttrs

function ModalContentComponent({
  className = '',
  children,
  ...props
}: React.PropsWithChildren<ModalContentProps>) {
  const { SCALES } = useScale()

  return (
    <>
      <div className={useClasses('content', className)} {...props}>
        {children}
      </div>
      <style jsx>{`
        .content {
          position: relative;
          text-align: left;
          font-size: ${SCALES.font(1)};
          width: ${SCALES.width(1, 'auto')};
          height: ${SCALES.height(1, 'auto')};
          padding: ${SCALES.pt(1.3125)} ${SCALES.pr(1.3125)}
            ${SCALES.pb(0.6625)} ${SCALES.pl(1.3125)};
          margin: ${SCALES.mt(0)}
            ${SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)')}
            ${SCALES.mb(0)}
            ${SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)')};
        }

        .content > :global(*:first-child) {
          margin-top: 0;
        }

        .content > :global(*:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </>
  )
}

ModalContentComponent.displayName = 'BolioUIModalContent'
const ModalContent = withScale(ModalContentComponent)
export default ModalContent
