import React from 'react'
import { LivePreview, LiveProvider, LiveError } from 'react-live'
import { Grid, useTheme } from 'core'
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
    <>
      <LiveProvider code={code} scope={scope} theme={codeTheme}>
        <Grid.Container gap={2} justify="flex-start">
          <Grid xs={12} sm={6} md={7}>
            <Editor />
          </Grid>
          <Grid xs={12} sm={6} md={5} justify="center" alignItems="center">
            <div className="wrapper">
              <LivePreview />
              <LiveError className="live-error" />
            </div>
          </Grid>
        </Grid.Container>
        <style jsx>{`
          .wrapper {
            width: 100%;
          }
          .wrapper > :global(div) {
            width: 100%;
            background-color: transparent;
          }
          .wrapper > :global(.live-error) {
            padding: 10px 12px 0 12px;
            margin-bottom: 0;
            border: 0;
            border-radius: ${theme.layout.radius};
            color: ${theme.palette.error};
            font-size: 12px;
            background-color: ${addColorAlpha(
              theme.palette.secondaryDark,
              0.1
            )};
          }
        `}</style>
      </LiveProvider>
    </>
  )
}

export default DynamicLive
