import React, { ReactNode } from 'react'
import useTheme from '../use-theme'

export interface InputBlockLabelLabel {
  children?: ReactNode
  error?: string
}

function InputBlockLabelComponent({ children, error }: InputBlockLabelLabel) {
  const theme = useTheme()

  return (
    <label>
      {children}
      <style jsx>{`
        label {
          display: block;
          font-weight: normal;
          color: ${error ? theme.palette.error : theme.palette.accents_6};
          padding: 0 0 0 1px;
          margin-bottom: 0.5em;
          margin-bottom: ${error && '0.5em'};
          font-size: ${error ? '0.875rem' : '1em'};
          line-height: 1.5;
        }

        label > :global(*:first-child) {
          margin-top: 0;
        }

        label > :global(*:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </label>
  )
}

InputBlockLabelComponent.displayName = 'BolioUIInputBlockLabel'
const InputBlockLabel = React.memo(InputBlockLabelComponent)
export default InputBlockLabel
