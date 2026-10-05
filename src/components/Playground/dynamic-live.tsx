import React, { useMemo } from 'react'
import { LivePreview, LiveProvider, LiveError } from 'react-live'
import { useTheme, Tabs, Card } from 'core'
import { addColorAlpha } from 'core/utils/color'
import makeCodeTheme from './code-theme'
import { transformLiveCode } from './transform-code'
import { buildPlaygroundSource } from './build-source'
import Editor from './editor'
import styles from './dynamic-live.module.css'

// Component is read by react-live but missing from its types. React 19 does
// not apply its defaultProps ('div') on function components, so it is passed.
const Preview = LivePreview as unknown as React.FC<{ Component: string }>

export interface Props {
  code: string
  scope: {
    [key: string]: unknown
  }
}

const DynamicLive: React.FC<Props> = ({ code, scope }) => {
  const theme = useTheme()
  const codeTheme = makeCodeTheme(theme)
  // What's actually executed (via `scope`) stays as-is; this is only for
  // display, a real file a reader could paste into their own project.
  const wrapperStyle = {
    '--live-error': theme.palette.error,
    '--live-radius': theme.layout.radius,
    '--live-error-bg': addColorAlpha(theme.palette.secondaryDark, 0.1)
  } as React.CSSProperties
  const displaySource = useMemo(
    () => buildPlaygroundSource(code, scope),
    [code, scope]
  )

  return (
    // react-live 2 sets these in defaultProps, which React 19 ignores on
    // function components, so they are passed explicitly
    <LiveProvider
      language="jsx"
      code={code}
      scope={scope}
      theme={codeTheme}
      noInline
      transformCode={transformLiveCode}
    >
      <Tabs initialValue="1" hideDivider hideBorder>
        <Tabs.Item label="Preview" value="1">
          <Card bordered style={{ backgroundColor: 'transparent' }}>
            <div className={styles.wrapper} style={wrapperStyle}>
              <Preview Component="div" />
              <LiveError className="live-error" />
            </div>
          </Card>
        </Tabs.Item>
        <Tabs.Item label="See code" value="2">
          <Card bordered style={{ backgroundColor: 'transparent' }} mb={1}>
            <div className={styles.wrapper} style={wrapperStyle}>
              <Preview Component="div" />
              <LiveError className="live-error" />
            </div>
          </Card>
          <Editor code={displaySource} codeTheme={codeTheme} />
        </Tabs.Item>
      </Tabs>
    </LiveProvider>
  )
}

export default DynamicLive
