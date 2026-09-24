import React, { useState } from 'react'
import Highlight, { Prism, PrismTheme } from 'prism-react-renderer'
import { useTheme, useToasts, useClipboard, Tooltip, Text } from 'core'
import { Copy, ChevronRight } from '@bolio-ui/icons'

interface Props {
  code: string
  codeTheme: PrismTheme
}

// A real file, read only: the live-editable version (react-live's
// LiveEditor) only ever ran the trimmed-down `code` a Playground executes,
// never something you could paste into an actual project as-is. `code` here
// is the generated version instead (see build-source.ts), imports included.
//
// The border/radius/background live on this one frame only — the header and
// the code are plain sections inside it, so there's a single outline instead
// of two boxes stacked on top of each other.
const Editor: React.FC<Props> = ({ code, codeTheme }) => {
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
    <div className="editor-frame">
      <div className="open-header" onClick={clickHandler}>
        <div className="action">
          <span className="arrow">
            <ChevronRight fontSize={16} color={theme.palette.accents_6} />
          </span>
          <Text style={{ color: theme.palette.accents_6 }}>
            {visible ? 'Hide code' : 'Show code'}
          </Text>
        </div>
        <div className="action">
          {visible && (
            <Tooltip onClick={copyHandler} text="Copy Code" scale={1 / 2}>
              <Copy fontSize={18} color={theme.palette.accents_6} />
            </Tooltip>
          )}
        </div>
      </div>
      {visible && (
        <Highlight Prism={Prism} code={code} language="jsx" theme={codeTheme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}

      <style jsx>{`
        .editor-frame {
          box-sizing: border-box;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.accents_1};
          overflow: hidden;
        }

        .open-header {
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 2.875rem;
          padding: 0 ${theme.layout.gapHalf};
          border-bottom: ${
            visible ? `1px solid ${theme.palette.border}` : 'none'
          };
          cursor: pointer;
        }

        .action {
          width: auto;
          display: flex;
          align-items: center;
          font-size: 0.8rem;
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

        .editor-frame :global(pre) {
          /* CssBaseline gives every <pre> its own border, radius and
             vertical margin — undoing all three here so this one doesn't
             show up as a second box, floating inside the frame's own. */
          margin: 0;
          border: none;
          padding: ${theme.layout.gapHalf} ${theme.layout.gap};
          overflow-x: auto;
          /* A scrollable child (overflow-x here) can keep its parent's
             overflow:hidden from clipping it to the rounded corners in some
             browsers, so the same radius is repeated here as a safeguard. */
          border-radius: ${theme.layout.radius};
        }
      `}</style>
    </div>
  )
}

export default Editor
