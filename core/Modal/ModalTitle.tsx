import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import { useModalContext } from './ModalContext'
import type { AnyElement } from '../utils/types'
import styles from './ModalTitle.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type ModalTitleProps = Props & NativeAttrs

function ModalTitleComponent({
  className = '',
  children,
  style,
  ...props
}: React.PropsWithChildren<ModalTitleProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()
  const { titleId } = useModalContext()

  const titleStyle: React.CSSProperties = {
    fontSize: SCALES.font(1.5),
    color: theme.palette.foreground,
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <h2
      id={titleId}
      className={`${styles.title} ${className}`.trim()}
      {...props}
      style={titleStyle}
    >
      {children}
    </h2>
  )
}

ModalTitleComponent.displayName = 'BolioUIModalTitle'
const ModalTitle = withScale(ModalTitleComponent)
export default ModalTitle
