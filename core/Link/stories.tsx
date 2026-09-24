import type { StoryFn, Meta } from '@storybook/react-vite'
import Link from '.'
import Grid from '../Grid'
import Text from '../Text'

export default {
  title: 'Navigation/Link',
  component: Link
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Link href="#">
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Grid>
  </Grid.Container>
)

export const Highlight: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Link href="#" color>
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Grid>
  </Grid.Container>
)

export const WithIcon: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Link href="#" icon>
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Grid>
    <Grid>
      <Link href="#" icon color>
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Grid>
  </Grid.Container>
)

export const Variant: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text>
        <Link href="#">
          Is a reference to the data you can follow directly by tapping.
        </Link>
      </Text>
    </Grid>
    <Grid>
      <Text>
        <Link href="#" color>
          Is a reference to the data you can follow directly by tapping.
        </Link>
      </Text>
    </Grid>
    <Grid>
      <Text>
        <Link href="#" underline>
          Is a reference to the data you can follow directly by tapping.
        </Link>
      </Text>
    </Grid>
    <Grid>
      <Text>
        <Link href="#" color underline>
          Is a reference to the data you can follow directly by tapping.
        </Link>
      </Text>
    </Grid>
  </Grid.Container>
)

export const Block: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Link href="#" block>
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Grid>
  </Grid.Container>
)
