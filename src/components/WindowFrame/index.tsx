import React from 'react'
import { useTheme } from 'core'
import styles from './WindowFrame.module.css'

interface Props {
  children: React.ReactNode
}

function WindowFrame({ children }: Props) {
  const theme = useTheme()

  return (
    <div
      className={styles.frame}
      style={
        {
          '--frame-border': theme.palette.border,
          '--frame-radius': theme.layout.radius,
          '--frame-bg': theme.palette.accents_1,
          '--frame-dot': theme.palette.accents_4,
          '--frame-gap': theme.layout.gap
        } as React.CSSProperties
      }
    >
      <div className={styles.bar}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default WindowFrame
