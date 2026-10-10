// Renders the default case of every component, the same list the smoke and
// accessibility tests use. The "layered" build imports the published
// stylesheet, the "source" build gets the CSS Modules of core/ unlayered.
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'
import { cases } from './cases'

const theme = new URLSearchParams(location.search).get('theme') || 'light'

createRoot(document.getElementById('root')!).render(
  <BolioUIProvider themeType={theme}>
    <CssBaseline />
    {cases.map(([name, render]) => (
      <section key={name} data-case={name}>
        {render()}
      </section>
    ))}
  </BolioUIProvider>
)
