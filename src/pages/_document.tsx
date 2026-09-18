import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'
import { CssBaseline } from 'core'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = CssBaseline.flush()

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      )
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              html[data-theme-pending] body {
                visibility: hidden;
                animation: bolio-theme-reveal 0s linear 2s forwards;
              }
              @keyframes bolio-theme-reveal {
                to { visibility: visible; }
              }`
            }}
          />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(){
                var theme = 'dark';
                try {
                  if (window.localStorage.getItem('theme') === 'light') theme = 'light';
                } catch (e) {}
                var background = theme === 'light' ? '#fff' : '#000';
                document.documentElement.style.background = background;
                document.body.style.background = background;
                if (theme === 'light') {
                  document.documentElement.setAttribute('data-theme-pending', theme);
                }
              })()`
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
