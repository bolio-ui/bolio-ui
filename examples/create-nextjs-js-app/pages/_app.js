import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'

function MyApp({ Component, pageProps }) {
  return (
    <BolioUIProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </BolioUIProvider>
  )
}
export default MyApp
