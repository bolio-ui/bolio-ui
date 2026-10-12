import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@bolio-ui/core/styles.css'
import { BolioUIProvider, CssBaseline, Page, Text } from '@bolio-ui/core'
import { blueTheme, violetTheme } from './theme'
import Home from './home'

const App = () => {
  const [theme, setTheme] = useState('light')
  return (
    <BolioUIProvider themes={[blueTheme, violetTheme]} themeType={theme}>
      <CssBaseline />
      <Page size="mini" dotBackdrop>
        <Page.Header>
          <Text h2>Custom themes for Bolio UI</Text>
        </Page.Header>
        <Home onThemeChange={(next) => setTheme(next)} />
      </Page>
    </BolioUIProvider>
  )
}

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

export default App
