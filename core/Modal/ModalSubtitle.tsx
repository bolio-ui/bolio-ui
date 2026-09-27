import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import { useModalContext } from './ModalContext'
import styles from './ModalSubtitle.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLHeadingElement>, keyof Props>
export type ModalSubtitleProps = Props & NativeAttrs

function ModalSubtitleComponent({
  className = '',
  children,
  style,
  ...props
}: React.PropsWithChildren<ModalSubtitleProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()
  const { descriptionId } = useModalContext()

  const subtitleStyle: React.CSSProperties = {
    color: theme.palette.accents_5,
    fontSize: SCALES.font(0.875),
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, '1.5em'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <p
      id={descriptionId}
      className={`${styles.subtitle} ${className}`.trim()}
      {...props}
      style={subtitleStyle}
    >
      {children}
    </p>
  )
}

ModalSubtitleComponent.displayName = 'BolioUIModalSubtitle'
const ModalSubtitle = withScale(ModalSubtitleComponent)
export default ModalSubtitle
