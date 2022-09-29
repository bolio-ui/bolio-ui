import { Story, Meta } from '@storybook/react'
import Description from '.'
import Code from '../code'
import Grid from '../grid'

export default {
  title: 'Data Display/Description',
  component: Description
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Description title="Section Title" content="Data about this section." />
    </Grid>
  </Grid.Container>
)

export const WithComponent: Story = () => (
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
