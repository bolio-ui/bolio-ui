import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import '@bolio-ui/core/styles.css'
import { BolioUIProvider, CssBaseline, ModalsProvider } from '@bolio-ui/core'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BolioUIProvider>
      <CssBaseline />
      {/* lets any component open a modal with useModals() */}
      <ModalsProvider labels={{ confirm: 'Yes', cancel: 'No' }}>
        <App />
      </ModalsProvider>
    </BolioUIProvider>
  </StrictMode>
)
