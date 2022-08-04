import { Story, Meta } from '@storybook/react'
import Tag from '.'
import Spacer from '../spacer'

export default {
  title: 'Data Display/Tag',
  component: Tag
} as Meta

export const Default: Story = () => <Tag>Status: Unstable</Tag>

export const Types: Story = () => (
  <>
    <Tag type="success">Success</Tag>
    <Spacer h={0.5} />
    <Tag type="warning">Warning</Tag>
    <Spacer h={0.5} />
    <Tag type="error">Error</Tag>
    <Spacer h={0.5} />
    <Tag type="secondary">Secondary</Tag>
    <Spacer h={0.5} />
    <Tag type="lite">Lite</Tag>
  </>
)

export const TypesInvert: Story = () => (
  <>
    <Tag type="default" invert>
      Default
    </Tag>
    <Spacer h={0.5} />
    <Tag type="success" invert>
      Success
    </Tag>
    <Spacer h={0.5} />
    <Tag type="warning" invert>
      Warning
    </Tag>
    <Spacer h={0.5} />
    <Tag type="error" invert>
      Error
    </Tag>
    <Spacer h={0.5} />
    <Tag type="secondary" invert>
      Secondary
    </Tag>
  </>
)
