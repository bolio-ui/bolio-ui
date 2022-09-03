import { Story, Meta } from '@storybook/react'
import Spacer from '.'
import Grid from '../grid'

export default {
  title: 'Layout/Spacer',
  component: Spacer
} as Meta

export const Vertical: Story = () => (
  <Grid.Container>
    <Grid xs={12} style={{ background: '#444', borderRadius: '15px' }}>
      <Spacer h={2} />
    </Grid>
    <Spacer h={2} />
    <Grid xs={12} style={{ background: '#666', borderRadius: '15px' }}>
      <Spacer h={3} />
    </Grid>
    <Spacer h={3} />
    <Grid xs={12} style={{ background: '#999', borderRadius: '15px' }}>
      <Spacer h={4} />
    </Grid>
  </Grid.Container>
)

export const Horizontal: Story = () => (
  <Grid.Container>
    <Grid xs={4} style={{ background: '#444', borderRadius: '15px' }} />
    <Spacer w={5} />
    <Grid xs={4} style={{ background: '#444', borderRadius: '15px' }} />
  </Grid.Container>
)
