import { Story, Meta } from '@storybook/react'
import Collapse from '.'
import Text from '../text'

export default {
  title: 'Surface/Collapse',
  component: Collapse
} as Meta

export const Default: Story = () => (
  <Collapse.Group>
    <Collapse title="Lorem ipsum 1">
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </Collapse>
    <Collapse title="Lorem ipsum 2">
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </Collapse>
  </Collapse.Group>
)

export const Expanded: Story = () => (
  <Collapse.Group>
    <Collapse title="Lorem ipsum 1" initialVisible>
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </Collapse>
    <Collapse title="Lorem ipsum 2">
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </Collapse>
  </Collapse.Group>
)

export const Subtitle: Story = () => (
  <Collapse.Group>
    <Collapse
      title="Lorem ipsum 1"
      subtitle="More description about Lorem ipsum 1"
    >
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </Collapse>
  </Collapse.Group>
)

export const Shadow: Story = () => (
  <Collapse
    shadow
    title="Lorem ipsum 1"
    subtitle="More description about Lorem ipsum 1"
  >
    <Text>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum
    </Text>
  </Collapse>
)
