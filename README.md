<p align="center">
  <a href="https://github.com/bolio-ui/bolio-ui">
    <img src="https://bolio-ui.com/logo-colored.svg" alt="Bolio UI Logo" width="100" />
  </a>
</p>

<h1 align="center">Bolio UI 🥷🏼</h1>

<p align="center">
  <a href="https://github.com/bolio-ui/bolio-ui/blob/master/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/bolio-ui/bolio-ui" />
  </a>
  <a href="https://www.npmjs.com/package/@bolio-ui/core">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@bolio-ui/core.svg?style=flat" />
  </a>
  <a href="https://github.com/bolio-ui/bolio-ui/">
    <img alt="Github Stars" src="https://badgen.net/github/stars/bolio-ui/bolio-ui" />
  </a>
  <a href="https://github.com/bolio-ui/bolio-ui/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/bolio-ui/bolio-ui?color=0088ff" />
  </a>
  <a href="https://github.com/bolio-ui/bolio-ui/pulls">
    <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/bolio-ui/bolio-ui?color=0088ff" />
  </a>
</p>

<br />

## Getting Started

Visit <a aria-label="bolio-ui learn" href="https://bolio-ui.com/docs/guide">https://bolio-ui.com/docs/guide</a> to get started with Bolio UI.

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
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'

const Application = () => (
  <BolioUIProvider>
    <CssBaseline /> // ---> Normalize styles
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

### Showcases

- [Bolio Icons](https://icons.bolio-ui.com/)
- [Bolio Me](https://me.bolio-ui.com/)
- [Bolio ChatGPT](https://chatgpt.bolio-ui.com/)

### Community

We're excited to see the community adopt Bolio UI, raise issues, and provide feedback.
Whether it's a feature request, bug report, or a project to showcase, please get involved!

- [Twitter](https://twitter.com/bolio_ui/)
- [Instagram](https://www.instagram.com/bolio.ui/)
- [GitHub](https://github.com/bolio-ui/bolio-ui/)

## License

[MIT](https://choosealicense.com/licenses/mit/) © [brunnoandrade](https://github.com/brunnoandrade/)
