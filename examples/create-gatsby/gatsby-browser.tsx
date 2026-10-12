import * as React from 'react'
import type { GatsbyBrowser } from 'gatsby'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'
import '@bolio-ui/core/styles.css'

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element
}) => (
  <BolioUIProvider>
    <CssBaseline />
    {element}
  </BolioUIProvider>
)
