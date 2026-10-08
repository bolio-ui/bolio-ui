import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import styles from './ModalActions.module.css'

const ModalActionsComponent: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
  ...props
}) => {
  const theme = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  // The dark border is as dark as the actions, so the lines need a lighter one
  const border =
    theme.type === 'dark' ? theme.palette.accents_4 : theme.palette.border
  const [height, setHeight] = useState<number | string>('auto')

  useEffect(() => {
    if (!ref.current) return
    setHeight(`${ref.current.clientHeight}px`)
  }, [ref])

  return (
    <>
      <div className={styles.spacer} style={{ height }} />
      <footer
        ref={ref}
        {...props}
        className={styles.footer}
        style={
          {
            borderTop: `1px solid ${border}`,
            borderBottomLeftRadius: theme.layout.radius,
            borderBottomRightRadius: theme.layout.radius,
            '--modal-actions-border': border
          } as React.CSSProperties
        }
      >
        {children}
      </footer>
    </>
  )
}

ModalActionsComponent.displayName = 'BolioUIModalActions'
const ModalActions = React.memo(ModalActionsComponent)
export default ModalActions
