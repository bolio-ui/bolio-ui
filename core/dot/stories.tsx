import { Story, Meta } from '@storybook/react'
import Dot from '.'
import Grid from '../grid'

export default {
  title: 'Data Display/Dot',
  component: Dot
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Dot />
    </Grid>
    <Grid>
      <Dot type="primary" />
    </Grid>
    <Grid>
      <Dot type="secondary" />
    </Grid>
    <Grid>
      <Dot type="success" />
    </Grid>
    <Grid>
      <Dot type="warning" />
    </Grid>
    <Grid>
      <Dot type="error" />
    </Grid>
    <Grid>
      <Dot type="info" />
    </Grid>
  </Grid.Container>
)

export const Text: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Dot>Canceled</Dot>
    </Grid>
    <Grid>
      <Dot type="primary">Primary</Dot>
    </Grid>
    <Grid>
      <Dot type="secondary">Secondary</Dot>
    </Grid>
    <Grid>
      <Dot type="success">Ready</Dot>
    </Grid>
    <Grid>
      <Dot type="warning">Warning</Dot>
    </Grid>
    <Grid>
      <Dot type="error">Error</Dot>
    </Grid>
    <Grid>
      <Dot type="info">Info</Dot>
    </Grid>
  </Grid.Container>
)
