import type { StoryFn, Meta } from '@storybook/react-vite'
import Keyboard from '.'
import Grid from '../Grid'

export default {
  title: 'Data Display/Keyboard',
  component: Keyboard
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Keyboard>C</Keyboard>
    </Grid>
  </Grid.Container>
)

export const Modifiers: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Keyboard command mr="10px" />
    </Grid>
    <Grid>
      <Keyboard shift mr="10px" />
    </Grid>
    <Grid>
      <Keyboard option mr="10px" />
    </Grid>
    <Grid>
      <Keyboard ctrl mr="10px" />
    </Grid>
  </Grid.Container>
)

export const Combination: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Keyboard command mr="10px">
        f
      </Keyboard>
    </Grid>
    <Grid>
      <Keyboard shift mr="10px">
        e
      </Keyboard>
    </Grid>
    <Grid>
      <Keyboard option ctrl mr="10px">
        b
      </Keyboard>
    </Grid>
  </Grid.Container>
)
