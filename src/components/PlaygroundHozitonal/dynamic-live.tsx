import React from 'react'
import { LivePreview, LiveProvider, LiveError } from 'react-live'
import { Grid, useTheme } from 'core'
import { addColorAlpha } from 'core/utils/color'
import makeCodeTheme from './code-theme'
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
  return (
    <>
      {/* react-live 2 sets language in defaultProps, which React 19 ignores */}
      <LiveProvider language="jsx" code={code} scope={scope} theme={codeTheme}>
        <Grid.Container gap={2} justify="flex-start">
          <Grid xs={12} sm={6} md={7}>
            <Editor />
          </Grid>
          <Grid xs={12} sm={6} md={5} justify="center" alignItems="center">
            <div
              className={styles.wrapper}
              style={
                {
                  '--live-radius': theme.layout.radius,
                  '--live-error': theme.palette.error,
                  '--live-error-bg': addColorAlpha(
                    theme.palette.secondaryDark,
                    0.1
                  )
                } as React.CSSProperties
              }
            >
              <Preview Component="div" />
              <LiveError className="live-error" />
            </div>
          </Grid>
        </Grid.Container>
      </LiveProvider>
    </>
  )
}

export default DynamicLive
