## Getting Started

Visit <a aria-label="bolio-ui learn" href="https://bolio-ui.com/docs/guide">https://bolio-ui.com/docs/guide</a> to get started with Bolio UI.

## Documentation

Visit [https://bolio-ui.com/docs](https://bolio-ui.com/docs) to view the full documentation.

## Quick Start

1. Installation: Inside your React project directory, install Bolio UI by running either of the following:

```bash
yarn add @bolio-ui/core
# or
npm i @bolio-ui/core
```

2. Setup: For Bolio UI to work correctly, you need to set up the CssBaseline at the root of your application.

Go to the root of your application and do this:

```jsx
import { BolioUIProvider } from '@bolio-ui/core'

const Application = () => (
  <BolioUIProvider>
    <AppComponent /> // ---> Your App Component
  </BolioUIProvider>
)
```

3. Using BolioUI components: Once Bolio UI is installed you can use any of the components as follows.
   Bolio UI uses tree-shaking so the unused modules will not be included in the bundle during the build process and
   each component is exported separately.

```jsx
import { Button } from '@bolio-ui/core'

const Component = () => <Button>Click me</Button>
```

### Community

We're excited to see the community adopt Bolio UI, raise issues, and provide feedback.
Whether it's a feature request, bug report, or a project to showcase, please get involved!

- [Twitter](https://twitter.com/bolio_ui/)
- [Instagram](https://www.instagram.com/bolio.ui/)
- [GitHub](https://github.com/bolio-ui/bolio-ui/)

## License

[MIT](https://choosealicense.com/licenses/mit/) © [brunnoandrade](https://github.com/brunnoandrade/)
