import type { Preview } from '@storybook/react-vite'
import '@bolio-ui/core/styles.css'
import { BolioUIProvider, CssBaseline } from '@bolio-ui/core'

const preview: Preview = {
  // a theme switch in the toolbar
  globalTypes: {
    theme: {
      description: 'Bolio UI theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => (
      // The provider reads the theme, and the stories use components that
      // need it, such as a toast or a Modal
      <BolioUIProvider themeType={context.globals.theme}>
        <CssBaseline />
        <Story />
      </BolioUIProvider>
    )
  ],
  // Storybook 10 shows a Docs page only for stories tagged with autodocs
  tags: ['autodocs']
}

export default preview
