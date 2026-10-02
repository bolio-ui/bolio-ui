import React, { ReactNode } from 'react'
import useTheme from '../use-theme'
import styles from './InputBlockLabel.module.css'

export interface InputBlockLabelLabel {
  children?: ReactNode
  error?: boolean
  id?: string
  htmlFor?: string
}

function InputBlockLabelComponent({
  children,
  error,
  id,
  htmlFor
}: InputBlockLabelLabel) {
  const theme = useTheme()

  const labelStyle: React.CSSProperties = {
    color: error ? theme.palette.error : theme.palette.accents_6,
    marginBottom: error ? 0 : '0.5em',
    marginTop: error ? '0.2em' : 0,
    fontSize: error ? '0.775rem' : '1em'
  }

  return (
    <label
      id={id}
      htmlFor={htmlFor}
      className={styles.label}
      style={labelStyle}
    >
      {children}
    </label>
  )
}

InputBlockLabelComponent.displayName = 'BolioUIInputBlockLabel'
const InputBlockLabel = React.memo(InputBlockLabelComponent)
export default InputBlockLabel
