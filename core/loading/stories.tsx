import { Story, Meta } from '@storybook/react'
import Loading from '.'
import Grid from '../grid'

export default {
  title: 'Feedback/Loading',
  component: Loading
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Loading />
    </Grid>
  </Grid.Container>
)

export const WithText: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Loading>Loading</Loading>
    </Grid>
  </Grid.Container>
)

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={3} md={3}>
      <Loading type="primary" />
    </Grid>
    <Grid xs={3} md={3}>
      <Loading type="secondary" />
    </Grid>
    <Grid xs={3} md={3}>
      <Loading type="success" />
    </Grid>
    <Grid xs={3} md={3}>
      <Loading type="warning" />
    </Grid>
    <Grid xs={3} md={3}>
      <Loading type="error" />
    </Grid>
    <Grid xs={3} md={3}>
      <Loading type="info" />
    </Grid>
  </Grid.Container>
)

export const Spaces: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={6} md={6}>
      <Loading spaceRatio={10} />
    </Grid>
    <Grid xs={6} md={6}>
      <Loading spaceRatio={5} />
    </Grid>
  </Grid.Container>
)
