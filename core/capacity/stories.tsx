import { Story, Meta } from '@storybook/react'
import useTheme from '../use-theme'
import Capacity from '.'
import Grid from '../grid'

export default {
  title: 'Data Display/Capacity',
  component: Capacity
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Capacity value={15} width="200px" />
    </Grid>
    <Grid>
      <Capacity value={45} width="200px" />
    </Grid>
    <Grid>
      <Capacity value={95} width="200px" />
    </Grid>
  </Grid.Container>
)

export const FixedColor: Story = () => {
  const theme = useTheme()
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Capacity value={75} color={theme.palette.success} width="200px" />
      </Grid>
    </Grid.Container>
  )
}
