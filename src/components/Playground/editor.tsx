import React, { useState } from 'react'
import { LiveEditor } from 'react-live'
import { useTheme, useToasts, useClipboard, Card, Tooltip, Text } from 'core'
import { Copy, ChevronRight } from '@bolio-ui/icons'

interface Props {
  code: string
}

const Editor: React.FC<Props> = ({ code }) => {
  const theme = useTheme()

  const { copy } = useClipboard()
  const { setToast } = useToasts()

  const [visible, setVisible] = useState(true)

  const clickHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setVisible(!visible)
  }

  const copyHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    copy(code)
    setToast({ text: 'Code copied!' })
  }

  return (
    <div className="editor">
      <Card bordered style={{ background: 'none' }}>
        <Card.Content onClick={clickHandler} px={0} py={0}>
          <div className="open-header">
            <div className="action">
              <span className="arrow">
                <ChevronRight fontSize={16} color="#FFFFFF" />
              </span>
              <Text style={{ color: '#FFFFFF' }}>
                {visible ? 'Hide code edit' : 'Show code edit'}
              </Text>
            </div>
            <div className="action">
              {visible && (
                <Tooltip onClick={copyHandler} text="Copy Code" scale={1 / 2}>
                  <Copy fontSize={18} color="#FFFFFF" />
                </Tooltip>
              )}
            </div>
          </div>
        </Card.Content>
        {visible && <LiveEditor />}
      </Card>

      <style jsx>{`
        .open-header {
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 2.875rem;
          padding: 0 ${theme.layout.gapHalf};
          background-color: ${theme.palette.pre};
          border-radius: ${theme.layout.radius};
          border-bottom-left-radius: ${visible ? 0 : theme.layout.radius};
          border-bottom-right-radius: ${visible ? 0 : theme.layout.radius};
        }

        .action {
          width: auto;
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .arrow {
          transition: all 0.2s ease;
          transform: rotate(${visible ? 90 : 0}deg);
          display: inline-flex;
          align-items: center;
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default Editor
