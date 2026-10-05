import React from 'react'
import { LiveEditor } from 'react-live'
import { useTheme } from 'core'
import styles from './editor.module.css'

const Editor: React.FC = () => {
  const theme = useTheme()

  return (
    <div
      className={styles.container}
      id="editor-area-container"
      style={
        {
          '--editor-radius': theme.layout.radius,
          '--editor-border': theme.palette.border,
          '--editor-gap-half': theme.layout.gapHalf
        } as React.CSSProperties
      }
    >
      <header className={styles.header} id="editor-area-header">
        <div className={styles.traffic}>
          <span className={styles.close} />
          <span className={styles.mini} />
          <span className={styles.full} />
        </div>
      </header>
      <div className={styles.area} id="editor-area">
        <LiveEditor id="live-editor" aria-labelledby="live editor" />
      </div>
    </div>
  )
}

export default Editor
