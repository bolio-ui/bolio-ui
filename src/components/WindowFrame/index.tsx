import React from 'react'
import { useTheme } from 'core'

interface Props {
  children: React.ReactNode
}

function WindowFrame({ children }: Props) {
  const theme = useTheme()

  return (
    <div className="window-frame">
      <div className="window-frame-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <div className="window-frame-content">{children}</div>
      <style jsx>{`
        .window-frame {
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.accents_1};
          overflow: hidden;
        }
        .window-frame-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          border-bottom: 1px solid ${theme.palette.border};
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${theme.palette.accents_4};
        }
        .window-frame-content {
          padding: ${theme.layout.gap};
        }
      `}</style>
    </div>
  )
}

export default WindowFrame
