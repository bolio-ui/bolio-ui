import { Story, Meta } from '@storybook/react'
import Toggle from '.'
import Grid from '../grid'

export default {
  title: 'Data Entry/Toggle',
  component: Toggle
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Toggle />
    </Grid>
    <Grid>
      <Toggle initialChecked />
    </Grid>
  </Grid.Container>
)

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Toggle type="default" initialChecked />
    </Grid>
    <Grid>
      <Toggle type="secondary" initialChecked />
    </Grid>
    <Grid>
      <Toggle type="success" initialChecked />
    </Grid>
    <Grid>
      <Toggle type="warning" initialChecked />
    </Grid>
    <Grid>
      <Toggle type="error" initialChecked />
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Toggle disabled />
    </Grid>
    <Grid>
      <Toggle initialChecked disabled />
    </Grid>
  </Grid.Container>
)
