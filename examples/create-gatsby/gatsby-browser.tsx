import * as React from 'react'
import type { GatsbyBrowser } from 'gatsby'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element
}) => (
  <BolioUIProvider>
    <CssBaseline />
    {element}
  </BolioUIProvider>
)
