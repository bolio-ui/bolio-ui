import { Story, Meta } from '@storybook/react'
import Code from '.'
import Text from '../Text'
import Grid from '../Grid'
import WaitTime from '../MdxWidgets/ParsedCodes/WaitTime'

export default {
  title: 'General/Code',
  component: Code
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text my={0}>
        Run <Code>npm i @bolio-ui/core</Code> to install.
      </Text>
      <Text my={0}>
        Or run <Code>yarn add @bolio-ui/core</Code> to install.
      </Text>
    </Grid>
  </Grid.Container>
)

export const Block: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)

export const Width: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block width="50%" my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)

export const Name: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block name="/Components/WaitTime.jsx" my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)

export const Classic: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block classic name="/Components/WaitTime.jsx" my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)
