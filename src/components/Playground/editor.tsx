import React, { useState } from 'react'
import Highlight, { Prism, PrismTheme } from 'prism-react-renderer'
import { useTheme, useToasts, useClipboard, Tooltip, Text } from 'core'
import { Copy, ChevronRight } from '@bolio-ui/icons'
import styles from './editor.module.css'

interface Props {
  code: string
  codeTheme: PrismTheme
}

// prism-react-renderer 1 returns `key: undefined` in the line and token
// props, and React 19 warns when a key comes in a spread
const withoutKey = <T extends object>(props: T) => {
  const rest: T & { key?: unknown } = { ...props }
  delete rest.key
  return rest
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
    <div
      className={`${styles.frame} ${visible ? styles.open : ''}`}
      style={
        {
          '--editor-border': theme.palette.border,
          '--editor-radius': theme.layout.radius,
          '--editor-bg': theme.palette.accents_1,
          '--editor-gap': theme.layout.gap,
          '--editor-gap-half': theme.layout.gapHalf
        } as React.CSSProperties
      }
    >
      <div className={styles.header} onClick={clickHandler}>
        <div className={styles.action}>
          <span className={styles.arrow}>
            <ChevronRight fontSize={16} color={theme.palette.accents_6} />
          </span>
          <Text style={{ color: theme.palette.accents_6 }}>
            {visible ? 'Hide code' : 'Show code'}
          </Text>
        </div>
        <div className={styles.action}>
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
                <div key={i} {...withoutKey(getLineProps({ line }))}>
                  {line.map((token, key) => (
                    <span key={key} {...withoutKey(getTokenProps({ token }))} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  )
}

export default Editor
