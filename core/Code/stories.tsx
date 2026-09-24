import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Code from '.'
import Text from '../Text'
import Grid from '../Grid'
import WaitTime from '../MdxWidgets/ParsedCodes/WaitTime'

export default {
  title: 'General/Code',
  component: Code
} as Meta

export const Default: StoryFn = () => (
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

export const Block: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)

export const Width: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block width="50%" my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)

export const Name: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block name="/Components/WaitTime.jsx" my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)

export const Tabs: StoryFn = () => {
  const [active, setActive] = React.useState(0)
  const codes = [
    "import { Button } from '@bolio-ui/core'",
    "import { Text } from '@bolio-ui/core'"
  ]
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Code
          block
          tabs={['/src/button.js', '/src/text.js']}
          activeTab={active}
          onTabChange={setActive}
          my={0}
        >
          {codes[active]}
        </Code>
      </Grid>
    </Grid.Container>
  )
}

export const Classic: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Code block classic name="/Components/WaitTime.jsx" my={0}>
        <WaitTime />
      </Code>
    </Grid>
  </Grid.Container>
)
