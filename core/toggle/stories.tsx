import { Story, Meta } from '@storybook/react'
import Toggle from '.'
import Spacer from '../spacer'

export default {
  title: 'Data Entry/Toggle',
  component: Toggle
} as Meta

export const Default: Story = () => (
  <>
    <Toggle />
    <Spacer h={0.5} />
    <Toggle initialChecked />
  </>
)

export const Type: Story = () => (
  <>
    <Toggle type="default" initialChecked />
    <Spacer h={0.5} />
    <Toggle type="secondary" initialChecked />
    <Spacer h={0.5} />
    <Toggle type="success" initialChecked />
    <Spacer h={0.5} />
    <Toggle type="warning" initialChecked />
    <Spacer h={0.5} />
    <Toggle type="error" initialChecked />
  </>
)

export const Disabled: Story = () => (
  <>
    <Toggle disabled />
    <Spacer h={0.5} />
    <Toggle initialChecked disabled />
  </>
)
