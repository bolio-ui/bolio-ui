import React from 'react'
import { useTheme } from 'core'
import styles from './attributes-table.module.css'

const AttributesTable: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const theme = useTheme()
  const isDark = theme.type === 'dark'
  return (
    <div
      className={styles.attr}
      style={
        {
          '--attr-gap': theme.layout.gap,
          '--attr-th-color': isDark ? '#ffffff' : theme.palette.accents_8,
          '--attr-th-bg': isDark ? theme.palette.pre : theme.palette.accents_2,
          '--attr-td-color': theme.palette.accents_6
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

export default AttributesTable
