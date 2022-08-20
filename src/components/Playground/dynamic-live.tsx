import React from 'react'
import { LivePreview, LiveProvider, LiveError } from 'react-live'
import { useTheme } from 'core'
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
      <div className="wrapper">
        <LivePreview />
        <LiveError className="live-error" />
      </div>
      <Editor code={code} />
      <style jsx>{`
        .wrapper {
          width: 100%;
          padding: ${theme.layout.pageMargin};
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          background-color: ${addColorAlpha(theme.palette.violetDark, 0.1)};
          border-color: ${addColorAlpha(theme.palette.violetDark, 0.1)};
        }
        .wrapper > :global(div) {
          width: 100%;
          background-color: transparent;
        }
        .wrapper > :global(.live-error) {
          padding: 10px 12px 0 12px;
          margin-bottom: 0;
          border: 2px ${theme.palette.error} dotted;
          border-radius: ${theme.layout.radius};
          color: ${theme.palette.errorLight};
          font-size: 13px;
          background-color: ${addColorAlpha(theme.palette.violetDark, 0.1)};
        }
      `}</style>
    </LiveProvider>
  )
}

export default DynamicLive