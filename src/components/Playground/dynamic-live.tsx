import React from 'react'
import { LivePreview, LiveProvider, LiveError } from 'react-live'
import { useTheme, Tabs, Card } from 'core'
import { addColorAlpha } from 'core/utils/color'
import makeCodeTheme from './code-theme'
import Editor from './editor'

export interface Props {
  code: string
  scope: {
    [key: string]: unknown
  }
}

const DynamicLive: React.FC<Props> = ({ code, scope }) => {
  const theme = useTheme()
  const codeTheme = makeCodeTheme(theme)

  return (
    <LiveProvider code={code} scope={scope} theme={codeTheme}>
      <Tabs initialValue="1" hideDivider hideBorder>
        <Tabs.Item label="Preview" value="1">
          <Card bordered style={{ background: 'none' }}>
            <div className="wrapper">
              <LivePreview />
              <LiveError className="live-error" />
            </div>
          </Card>
        </Tabs.Item>
        <Tabs.Item label="See code" value="2">
          <Card bordered style={{ background: 'none' }} mb={1}>
            <div className="wrapper">
              <LivePreview />
              <LiveError className="live-error" />
            </div>
          </Card>
          <Editor code={code} />
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
