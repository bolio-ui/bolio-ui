import { Story, Meta } from '@storybook/react'
import ButtonDropdown from '.'
import Spacer from '../spacer'
import { Plus } from '@bolio-ui/icons'

export default {
  title: 'Navigation/ButtonDropdown',
  component: ButtonDropdown
} as Meta

export const Default: Story = () => (
  <ButtonDropdown>
    <ButtonDropdown.Item main>Default Button</ButtonDropdown.Item>
    <ButtonDropdown.Item>Secondary Button</ButtonDropdown.Item>
    <ButtonDropdown.Item>Tertiary Button</ButtonDropdown.Item>
  </ButtonDropdown>
)

export const Loading: Story = () => (
  <ButtonDropdown loading>
    <ButtonDropdown.Item main>Default Button</ButtonDropdown.Item>
    <ButtonDropdown.Item>Secondary Button</ButtonDropdown.Item>
    <ButtonDropdown.Item>Tertiary Button</ButtonDropdown.Item>
  </ButtonDropdown>
)

export const Disabled: Story = () => (
  <ButtonDropdown disabled>
    <ButtonDropdown.Item main>Default Button</ButtonDropdown.Item>
    <ButtonDropdown.Item>Secondary Button</ButtonDropdown.Item>
    <ButtonDropdown.Item>Tertiary Button</ButtonDropdown.Item>
  </ButtonDropdown>
)

export const Types: Story = () => (
  <>
    <ButtonDropdown type="secondary" scale={0.5}>
      <ButtonDropdown.Item main>Secondary Button</ButtonDropdown.Item>
    </ButtonDropdown>
    <Spacer h={0.5} />
    <ButtonDropdown type="success" scale={0.5}>
      <ButtonDropdown.Item main>Success Button</ButtonDropdown.Item>
    </ButtonDropdown>
    <Spacer h={0.5} />
    <ButtonDropdown type="warning" scale={0.5}>
      <ButtonDropdown.Item main>Warning Button</ButtonDropdown.Item>
    </ButtonDropdown>
    <Spacer h={0.5} />
    <ButtonDropdown type="error" scale={0.5}>
      <ButtonDropdown.Item main>Error Button</ButtonDropdown.Item>
    </ButtonDropdown>
  </>
)

export const MultipleType: Story = () => (
  <ButtonDropdown scale={2 / 3} auto>
    <ButtonDropdown.Item main>Check</ButtonDropdown.Item>
    <ButtonDropdown.Item>Block</ButtonDropdown.Item>
    <ButtonDropdown.Item>Lock</ButtonDropdown.Item>
    <ButtonDropdown.Item type="error">Destroy</ButtonDropdown.Item>
  </ButtonDropdown>
)

export const CustomIcon: Story = () => (
  <ButtonDropdown scale={2 / 3} auto icon={<Plus />}>
    <ButtonDropdown.Item main>Check User</ButtonDropdown.Item>
    <ButtonDropdown.Item>Block User</ButtonDropdown.Item>
    <ButtonDropdown.Item>Lock User</ButtonDropdown.Item>
    <ButtonDropdown.Item type="error">Destroy User</ButtonDropdown.Item>
  </ButtonDropdown>
)
