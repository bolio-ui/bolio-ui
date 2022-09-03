import { Story, Meta } from '@storybook/react'
import Snippet from '.'
import Spacer from '../spacer'

export default {
  title: 'Others/Snippet',
  component: Snippet
} as Meta

export const Default: Story = () => (
  <Snippet text="yarn add @bolio-ui/core" width="300px" />
)

export const Width: Story = () => (
  <Snippet text="yarn add @bolio-ui/core" width="100%" />
)

export const Types: Story = () => (
  <>
    <Snippet text="yarn add @bolio-ui/core" type="dark" width="300px" />
    <Spacer />
    <Snippet text="yarn add @bolio-ui/core" type="success" width="300px" />
    <Spacer />
    <Snippet text="yarn add @bolio-ui/core" type="warning" width="300px" />
    <Spacer />
    <Snippet text="yarn add @bolio-ui/core" type="error" width="300px" />
    <Spacer />
    <Snippet text="yarn add @bolio-ui/core" type="secondary" width="300px" />
    <Spacer />
    <Snippet text="yarn add @bolio-ui/core" type="lite" width="300px" />
  </>
)

export const Multiline: Story = () => (
  <Snippet text={['cd project', 'now']} width="300px" />
)

export const DisabledCopy: Story = () => (
  <Snippet copy="prevent" text="yarn add @bolio-ui/core" width="300px" />
)

export const CustomSymbol: Story = () => (
  <Snippet symbol=">" text="yarn add @bolio-ui/core" width="300px" />
)

export const CustomToast: Story = () => (
  <Snippet
    toastText="Code copied!"
    toastType="secondary"
    text="yarn add @bolio-ui/core"
    width="300px"
  />
)

export const Filled: Story = () => (
  <>
    <Snippet
      text="yarn add @bolio-ui/core"
      type="success"
      filled
      width="300px"
    />
    <Spacer />
    <Snippet
      text="yarn add @bolio-ui/core"
      type="warning"
      filled
      width="300px"
    />
    <Spacer />
    <Snippet text="yarn add @bolio-ui/core" type="error" filled width="300px" />
    <Spacer />
    <Snippet
      text="yarn add @bolio-ui/core"
      type="secondary"
      filled
      width="300px"
    />
  </>
)
