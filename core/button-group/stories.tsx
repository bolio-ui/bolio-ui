import { Story, Meta } from '@storybook/react'
import ButtonGroup from '.'
import Button from '../button'
import ButtonDropdown from '../button-dropdown'

export default {
  title: 'Data Entry/ButtonGroup',
  component: ButtonGroup
} as Meta

export const Default: Story = () => (
  <ButtonGroup>
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
)

export const Variant: Story = () => (
  <>
    <ButtonGroup type="success">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
    <ButtonGroup type="abort">
      <Button>Action1</Button>
      <Button>Action2</Button>
    </ButtonGroup>
    <ButtonGroup type="warning" ghost>
      <Button>Action1</Button>
      <Button>Action2</Button>
    </ButtonGroup>
    <ButtonGroup type="success-light">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  </>
)

export const Sizes: Story = () => (
  <>
    <ButtonGroup scale={2 / 3}>
      <Button scale={2 / 3}>One</Button>
      <Button scale={2 / 3}>Two</Button>
      <Button scale={2 / 3}>Three</Button>
    </ButtonGroup>
    <ButtonGroup scale={1 / 3}>
      <Button scale={1 / 3}>Action1</Button>
      <Button scale={1 / 3}>Action2</Button>
    </ButtonGroup>
  </>
)

export const Vertical: Story = () => (
  <>
    <ButtonGroup vertical>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
      <Button>Four</Button>
    </ButtonGroup>
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

export const Disabled: Story = () => (
  <>
    <ButtonGroup scale={0.5} disabled>
      <Button scale={0.5}>One</Button>
      <Button scale={0.5}>Two</Button>
      <Button scale={0.5}>Three</Button>
    </ButtonGroup>
  </>
)
