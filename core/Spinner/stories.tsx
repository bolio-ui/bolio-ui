import type { StoryFn, Meta } from '@storybook/react-vite'
import Spinner from '.'
import Grid from '../Grid'

export default {
  title: 'Feedback/Spinner',
  component: Spinner
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Spinner scale={2} />
    </Grid>
  </Grid.Container>
)
