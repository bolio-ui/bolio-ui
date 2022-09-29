import { Story, Meta } from '@storybook/react'
import Card from '../card'
import Grid from '../grid'
import { Smile } from '@bolio-ui/icons'

export default {
  title: 'General/Icons',
  component: Card
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Smile />
    </Grid>
  </Grid.Container>
)

export const Colored: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Smile color="purple" />
    </Grid>
  </Grid.Container>
)

export const Size: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Smile fontSize={16} />
    </Grid>
    <Grid>
      <Smile fontSize={20} />
    </Grid>
    <Grid>
      <Smile fontSize={24} />
    </Grid>
    <Grid>
      <Smile fontSize={28} />
    </Grid>
    <Grid>
      <Smile fontSize={32} />
    </Grid>
    <Grid>
      <Smile fontSize={36} />
    </Grid>
  </Grid.Container>
)
