import { Story, Meta } from '@storybook/react'
import Input from '.'
import Grid from '../Grid'
import Text from '../Text'
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
      <Input placeholder="Default" />
    </Grid>
    <Grid>
      <Input type="primary" placeholder="Primary" />
    </Grid>
    <Grid>
      <Input type="secondary" placeholder="Secondary" />
    </Grid>
    <Grid>
      <Input type="success" placeholder="Success" />
    </Grid>
    <Grid>
      <Input type="warning" placeholder="Warning" />
    </Grid>
    <Grid>
      <Input type="error" placeholder="Error" />
    </Grid>
    <Grid>
      <Input type="info" placeholder="Info" />
    </Grid>
  </Grid.Container>
)

export const Rounded: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Input placeholder="Default" rounded />
    </Grid>
    <Grid>
      <Input type="primary" placeholder="Primary" rounded />
    </Grid>
    <Grid>
      <Input type="secondary" placeholder="Secondary" rounded />
    </Grid>
    <Grid>
      <Input type="success" placeholder="Success" rounded />
    </Grid>
    <Grid>
      <Input type="warning" placeholder="Warning" rounded />
    </Grid>
    <Grid>
      <Input type="error" placeholder="Error" rounded />
    </Grid>
    <Grid>
      <Input type="info" placeholder="Info" rounded />
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
