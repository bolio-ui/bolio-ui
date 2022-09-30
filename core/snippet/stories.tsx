import { Story, Meta } from '@storybook/react'
import Snippet from '.'
import Grid from '../grid'

export default {
  title: 'Others/Snippet',
  component: Snippet
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" width="300px" />
    </Grid>
  </Grid.Container>
)

export const Width: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" width="100%" />
    </Grid>
  </Grid.Container>
)

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text="yarn add @bolio-ui/core" type="dark" width="300px" />
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
  </Grid.Container>
)

export const Multiline: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet text={['cd project', 'now']} width="300px" />
    </Grid>
  </Grid.Container>
)

export const DisabledCopy: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet copy="prevent" text="yarn add @bolio-ui/core" width="300px" />
    </Grid>
  </Grid.Container>
)

export const CustomSymbol: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Snippet symbol=">" text="yarn add @bolio-ui/core" width="300px" />
    </Grid>
  </Grid.Container>
)

export const CustomToast: Story = () => (
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

export const Filled: Story = () => (
  <Grid.Container gap={2}>
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
        type="secondary"
        filled
        width="300px"
      />
    </Grid>
  </Grid.Container>
)
