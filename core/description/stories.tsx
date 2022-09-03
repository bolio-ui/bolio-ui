import { Story, Meta } from '@storybook/react'
import Description from '.'
import Code from '../code'

export default {
  title: 'Data Display/Description',
  component: Description
} as Meta

export const Default: Story = () => (
  <Description title="Section Title" content="Data about this section." />
)

export const WithComponent: Story = () => (
  <Description
    title="Section Title"
    content={
      <p>
        <Code>code</Code> about this section.
      </p>
    }
  />
)
