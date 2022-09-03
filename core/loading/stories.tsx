import { Story, Meta } from '@storybook/react'
import Loading from '.'
import Grid from '../grid'

export default {
  title: 'Feedback/Loading',
  component: Loading
} as Meta

export const Default: Story = () => <Loading />

export const WithText: Story = () => <Loading>Loading</Loading>

export const Types: Story = () => (
  <Grid.Container gap={2.5}>
    <Grid xs={12}>
      <Loading type="success" />
    </Grid>
    <Grid xs={12}>
      <Loading type="secondary" />
    </Grid>
    <Grid xs={12}>
      <Loading type="warning" />
    </Grid>
    <Grid xs={12}>
      <Loading type="error" />
    </Grid>
  </Grid.Container>
)

export const Spaces: Story = () => (
  <Grid.Container gap={2.5}>
    <Grid xs={12}>
      <Loading spaceRatio={2.5} />
    </Grid>
    <Grid xs={12}>
      <Loading spaceRatio={0.5} />
    </Grid>
  </Grid.Container>
)
