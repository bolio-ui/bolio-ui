import type { StoryFn, Meta } from '@storybook/react-vite'
import Toggle from '.'
import Grid from '../Grid'

export default {
  title: 'Data Entry/Toggle',
  component: Toggle
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Toggle />
    </Grid>
    <Grid>
      <Toggle initialChecked />
    </Grid>
  </Grid.Container>
)

export const Type: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Toggle scale={2} initialChecked />
    </Grid>
    <Grid>
      <Toggle type="primary" scale={2} initialChecked />
    </Grid>
    <Grid>
      <Toggle type="secondary" scale={2} initialChecked />
    </Grid>
    <Grid>
      <Toggle type="success" scale={2} initialChecked />
    </Grid>
    <Grid>
      <Toggle type="warning" scale={2} initialChecked />
    </Grid>
    <Grid>
      <Toggle type="error" scale={2} initialChecked />
    </Grid>
    <Grid>
      <Toggle type="info" scale={2} initialChecked />
    </Grid>
  </Grid.Container>
)

export const Disabled: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Toggle disabled />
    </Grid>
    <Grid>
      <Toggle initialChecked disabled />
    </Grid>
  </Grid.Container>
)
