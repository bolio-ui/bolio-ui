import { Story, Meta } from '@storybook/react'
import Input from '.'
import Grid from '../grid'
import Text from '../text'
import { Instagram, Facebook } from '@bolio-ui/icons'

export default {
  title: 'Data Entry/Input',
  component: Input
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input placeholder="Placeholder Text" />
    </Grid>
  </Grid.Container>
)

export const Sizes: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input scale={1 / 3} placeholder="Scale 1/3" />
    </Grid>
    <Grid>
      <Input scale={2 / 3} placeholder="Scale 2/3" />
    </Grid>
    <Grid>
      <Input placeholder="Scale 1" />
    </Grid>
    <Grid>
      <Input scale={4 / 3} placeholder="Scale 4/3" />
    </Grid>
  </Grid.Container>
)

export const SetWidth: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input placeholder="Placeholder Text" width="100%" />
    </Grid>
  </Grid.Container>
)

export const Unwritable: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input disabled placeholder="Disabled" />
    </Grid>
    <Grid>
      <Input readOnly initialValue="Read Only" />
    </Grid>
  </Grid.Container>
)

export const BlockLabel: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input placeholder="Block Label">
        <Text h3>Block Label</Text>
      </Input>
    </Grid>
    <Grid>
      <Input placeholder="Block Label">Block Label</Input>
    </Grid>
  </Grid.Container>
)

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input type="secondary" initialValue="Initial Value" />
    </Grid>
    <Grid>
      <Input type="success" initialValue="Initial Value" />
    </Grid>
    <Grid>
      <Input type="warning" initialValue="Initial Value" />
    </Grid>
    <Grid>
      <Input type="error" initialValue="Initial Value" />
    </Grid>
  </Grid.Container>
)

export const Icon: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input icon={<Instagram />} placeholder="Instagram" />
    </Grid>
    <Grid>
      <Input iconRight={<Facebook />} placeholder="Facebook" />
    </Grid>
  </Grid.Container>
)

export const Clearable: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input
        clearable
        initialValue="Initial Value"
        placeholder="Initial Value"
      />
    </Grid>
  </Grid.Container>
)

export const Password: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input.Password initialValue="123456abc" />
    </Grid>
  </Grid.Container>
)
