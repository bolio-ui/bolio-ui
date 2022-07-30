import { Story, Meta } from '@storybook/react'
import Input from '.'
import Spacer from '../spacer'
import Text from '../text'
import { Instagram, Facebook } from '@bolio-ui/icons'

export default {
  title: 'Data Entry/Input',
  component: Input
} as Meta

export const Default: Story = () => <Input placeholder="Placeholder Text" />

export const Sizes: Story = () => (
  <>
    <Input scale={1 / 3} placeholder="Scale 1/3" /> <Spacer h={0.5} />
    <Input scale={2 / 3} placeholder="Scale 2/3" /> <Spacer h={0.5} />
    <Input placeholder="Scale 1" /> <Spacer h={0.5} />
    <Input scale={4 / 3} placeholder="Scale 4/3" />
  </>
)

export const SetWidth: Story = () => (
  <Input placeholder="Placeholder Text" width="100%" />
)

export const Unwritable: Story = () => (
  <>
    <Input disabled placeholder="Disabled" />
    <Spacer h={0.5} />
    <Input readOnly initialValue="Read Only" />
  </>
)

export const BlockLabel: Story = () => (
  <>
    <Input placeholder="Block Label" width="50%">
      <Text h3>Block Label</Text>
    </Input>
    <Spacer />
    <Input placeholder="Block Label">Block Label</Input>
  </>
)

export const Type: Story = () => (
  <>
    <Input type="secondary" initialValue="Initial Value" />
    <Spacer h={0.5} />
    <Input type="success" initialValue="Initial Value" />
    <Spacer h={0.5} />
    <Input type="warning" initialValue="Initial Value" />
    <Spacer h={0.5} />
    <Input type="error" initialValue="Initial Value" />
  </>
)

export const Icon: Story = () => (
  <>
    <Input icon={<Instagram />} placeholder="Instagram" />
    <Spacer h={0.5} />
    <Input iconRight={<Facebook />} placeholder="Facebook" />
  </>
)

export const Clearable: Story = () => (
  <Input clearable initialValue="Initial Value" placeholder="Initial Value" />
)

export const Password: Story = () => <Input.Password initialValue="123456abc" />
