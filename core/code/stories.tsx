import { Story, Meta } from '@storybook/react'
import Code from '.'
import Text from '../text'
import WaitTime from '../mdx-widgets/parsed-codes/wait-time'

export default {
  title: 'General/Code',
  component: Code
} as Meta

export const Default: Story = () => (
  <>
    <Text my={0}>
      Run <Code>npm i @bolio-ui/core</Code> to install.
    </Text>
    <Text my={0}>
      Or run <Code>yarn add @bolio-ui/core</Code> to install.
    </Text>
  </>
)

export const Block: Story = () => (
  <Code block my={0}>
    <WaitTime />
  </Code>
)

export const Width: Story = () => (
  <Code block width="50%" my={0}>
    <WaitTime />
  </Code>
)

export const Name: Story = () => (
  <Code block name="/Components/WaitTime.jsx" my={0}>
    <WaitTime />
  </Code>
)

export const Classic: Story = () => (
  <Code block classic name="/Components/WaitTime.jsx" my={0}>
    <WaitTime />
  </Code>
)
