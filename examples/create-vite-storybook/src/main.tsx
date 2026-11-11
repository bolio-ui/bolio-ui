import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import '@bolio-ui/core/styles.css'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BolioUIProvider>
      <CssBaseline />
      <App />
    </BolioUIProvider>
  </StrictMode>
)
