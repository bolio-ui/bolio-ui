import { Story, Meta } from '@storybook/react'
import Spinner from '.'
import Grid from '../Grid'

export default {
  title: 'Feedback/Spinner',
  component: Spinner
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Spinner scale={2} />
    </Grid>
  </Grid.Container>
)
