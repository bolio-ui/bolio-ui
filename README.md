<p align="center">
  <a href="https://github.com/chakra-ui/chakra-ui">
    <img src="https://github.com/bolio-ui/bolio-ui/blob/master/public/logo-colored.svg" alt="Bolio UI Logo" width="80" />
  </a>
</p>

<h1 align="center">Bolio UI 🥷🏼</h1>

<p align="center">
  <img alt="Bundle Size" src="https://badgen.net/bundlephobia/minzip/@bolio-ui/core"/>
  <img alt="MIT License" src="https://img.shields.io/github/license/bolio-ui/bolio-ui"/>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@bolio-ui/core.svg?style=flat"/>
  <img alt="Github Stars" src="https://badgen.net/github/stars/bolio-ui/bolio-ui" />
</p>

<br />

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
