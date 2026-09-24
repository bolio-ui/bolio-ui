import type { StoryFn, Meta } from '@storybook/react-vite'
import Display from '.'
import Text from '../Text'

export default {
  title: 'Data Display/Display',
  component: Display
} as Meta

export const Default: StoryFn = () => (
  <Display caption="A caption below the content">
    <img src="/logo.svg" alt="Bolio UI logo" width={120} height={120} />
  </Display>
)

export const Shadow: StoryFn = () => (
  <Display shadow caption="The shadow shows only in the light theme">
    <img src="/logo.svg" alt="Bolio UI logo" width={120} height={120} />
  </Display>
)

export const WithText: StoryFn = () => (
  <Display caption="Any content can go inside">
    <Text>Text inside a Display.</Text>
  </Display>
)
