import { Story, Meta } from '@storybook/react'
import Collapse from '.'
import Text from '../Text'
import Grid from '../Grid'

export default {
  title: 'Surface/Collapse',
  component: Collapse
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Collapse.Group>
        <Collapse title="Lorem ipsum 1">
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </Collapse>
        <Collapse title="Lorem ipsum 2">
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </Collapse>
      </Collapse.Group>
    </Grid>
  </Grid.Container>
)

export const Expanded: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Collapse.Group>
        <Collapse title="Lorem ipsum 1" initialVisible>
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </Collapse>
        <Collapse title="Lorem ipsum 2">
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </Collapse>
      </Collapse.Group>
    </Grid>
  </Grid.Container>
)

export const Subtitle: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Collapse.Group>
        <Collapse
          title="Lorem ipsum 1"
          subtitle="More description about Lorem ipsum 1"
        >
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </Collapse>
        <Collapse
          title="Lorem ipsum 2"
          subtitle={
            <>
              More description about <Text b>Lorem ipsum 2</Text>
            </>
          }
        >
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </Collapse>
      </Collapse.Group>
    </Grid>
  </Grid.Container>
)

export const Shadow: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Collapse
        shadow
        title="Lorem ipsum 1"
        subtitle="More description about Lorem ipsum 1"
      >
        <Text>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum
        </Text>
      </Collapse>
    </Grid>
  </Grid.Container>
)
