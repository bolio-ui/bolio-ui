import type { AppProps } from 'next/app'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BolioUIProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </BolioUIProvider>
  )
}
export default MyApp
