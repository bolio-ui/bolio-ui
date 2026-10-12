import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'
import bolioStyles from '@bolio-ui/core/styles.css?url'

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <link rel="stylesheet" href={bolioStyles} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>@redwoodjs/starter-minimal</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=optional"
        precedence="first"
      />
      <link rel="modulepreload" href="/src/client.tsx" />
    </head>
    <body>
      <BolioUIProvider>
        <CssBaseline />
        {children}
      </BolioUIProvider>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
