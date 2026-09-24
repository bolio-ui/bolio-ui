import type { StoryFn, Meta } from '@storybook/react-vite'
import Description from '.'
import Code from '../Code'
import Grid from '../Grid'

export default {
  title: 'Data Display/Description',
  component: Description
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Description title="Section Title" content="Data about this section." />
    </Grid>
  </Grid.Container>
)

export const WithComponent: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Description
        title="Section Title"
        content={
          <p>
            <Code>code</Code> about this section.
          </p>
        }
      />
    </Grid>
  </Grid.Container>
)
