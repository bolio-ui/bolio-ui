import React, { useMemo } from 'react'
import { LivePreview, LiveProvider, LiveError } from 'react-live'
import { useTheme, Tabs, Card } from 'core'
import { addColorAlpha } from 'core/utils/color'
import makeCodeTheme from './code-theme'
import { transformLiveCode } from './transform-code'
import { buildPlaygroundSource } from './build-source'
import Editor from './editor'

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
          <Card bordered style={{ background: 'none' }}>
            <div className="wrapper">
              <Preview Component="div" />
              <LiveError className="live-error" />
            </div>
          </Card>
        </Tabs.Item>
        <Tabs.Item label="See code" value="2">
          <Card bordered style={{ background: 'none' }} mb={1}>
            <div className="wrapper">
              <Preview Component="div" />
              <LiveError className="live-error" />
            </div>
          </Card>
          <Editor code={displaySource} codeTheme={codeTheme} />
        </Tabs.Item>
      </Tabs>
      <style jsx>{`
        .wrapper {
          width: 100%;
          /* padding: ${theme.layout.pageMargin}; */
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .wrapper > :global(div) {
          width: 100%;
          background-color: transparent;
        }
        .wrapper > :global(.live-error) {
          margin-top: 0;
          margin-bottom: 0;
          border: 2px ${theme.palette.error} dotted;
          border-radius: ${theme.layout.radius};
          color: ${theme.palette.error};
          font-size: 12px;
          background-color: ${addColorAlpha(theme.palette.secondaryDark, 0.1)};
        }
      `}</style>
    </LiveProvider>
  )
}

export default DynamicLive
