import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './ModalContent.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLElement>, keyof Props>
export type ModalContentProps = Props & NativeAttrs

function ModalContentComponent({
  className = '',
  children,
  style,
  ...props
}: React.PropsWithChildren<ModalContentProps>) {
  const { SCALES } = useScale()

  const contentStyle: React.CSSProperties = {
    fontSize: SCALES.font(1),
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(1.3125)} ${SCALES.pr(1.3125)} ${SCALES.pb(0.6625)} ${SCALES.pl(1.3125)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)')} ${SCALES.mb(0)} ${SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)')}`,
    ...style
  }

  return (
    <div
      className={useClasses(styles.content, className)}
      {...props}
      style={contentStyle}
    >
      {children}
    </div>
  )
}

ModalContentComponent.displayName = 'BolioUIModalContent'
const ModalContent = withScale(ModalContentComponent)
export default ModalContent
