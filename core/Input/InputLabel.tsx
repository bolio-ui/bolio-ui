import React, { ReactNode } from 'react'
import useTheme from '../use-theme'
import styles from './InputLabel.module.css'

export interface InputLabel {
  isRight?: boolean
  children?: ReactNode
}

function InputLabel({ children, isRight }: InputLabel) {
  const theme = useTheme()

  const labelStyle: React.CSSProperties = {
    padding: `0 ${theme.layout.gapHalf}`,
    color: theme.palette.accents_4,
    backgroundColor: theme.palette.accents_1,
    borderTopLeftRadius: isRight ? 0 : theme.layout.radius,
    borderBottomLeftRadius: isRight ? 0 : theme.layout.radius,
    borderTopRightRadius: isRight ? theme.layout.radius : 0,
    borderBottomRightRadius: isRight ? theme.layout.radius : 0,
    borderTop: `1px solid ${theme.palette.border}`,
    borderBottom: `1px solid ${theme.palette.border}`,
    borderLeft: isRight ? 'none' : `1px solid ${theme.palette.border}`,
    borderRight: isRight ? `1px solid ${theme.palette.border}` : 'none'
  }

  return (
    <span className={styles.span} style={labelStyle}>
      {children}
    </span>
  )
}

const MemoInputLabel = React.memo(InputLabel)

export default MemoInputLabel
