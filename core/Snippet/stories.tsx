import type { StoryFn, Meta } from '@storybook/react-vite'
import Snippet from '.'
import Grid from '../Grid'

export default {
  title: 'Others/Snippet',
  component: Snippet
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" width="300px" />
    </Grid>
  </Grid.Container>
)

export const Width: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" width="100%" />
    </Grid>
  </Grid.Container>
)

export const Types: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="primary" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="secondary" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="success" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="warning" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="error" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="secondary" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="lite" width="300px" />
    </Grid>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="dark" width="300px" />
    </Grid>
  </Grid.Container>
)

export const Rounded: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" width="300px" rounded />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="primary"
        width="300px"
        rounded
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="secondary"
        width="300px"
        rounded
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="success"
        width="300px"
        rounded
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="warning"
        width="300px"
        rounded
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="error"
        width="300px"
        rounded
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="lite"
        width="300px"
        rounded
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="dark"
        width="300px"
        rounded
      />
    </Grid>
  </Grid.Container>
)

export const Multiline: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text={['cd project', 'now']} width="300px" />
    </Grid>
  </Grid.Container>
)

export const DisabledCopy: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet copy="prevent" text="yarn add @bolio-ui/core" width="300px" />
    </Grid>
  </Grid.Container>
)

export const CustomSymbol: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet symbol=">" text="yarn add @bolio-ui/core" width="300px" />
    </Grid>
  </Grid.Container>
)

export const CustomToast: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet
        toastText="Code copied!"
        toastType="secondary"
        text="yarn add @bolio-ui/core"
        width="300px"
      />
    </Grid>
  </Grid.Container>
)

export const Filled: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="primary"
        filled
        width="300px"
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="secondary"
        filled
        width="300px"
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="success"
        filled
        width="300px"
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="warning"
        filled
        width="300px"
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="error"
        filled
        width="300px"
      />
    </Grid>
    <Grid>
      <Snippet
        text="yarn add @bolio-ui/core"
        type="info"
        filled
        width="300px"
      />
    </Grid>
  </Grid.Container>
)
