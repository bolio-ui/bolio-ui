import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <BolioUIProvider>
        <RedwoodApolloProvider>
          <CssBaseline />
          <Routes />
        </RedwoodApolloProvider>
      </BolioUIProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
