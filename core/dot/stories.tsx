import { Story, Meta } from '@storybook/react'
import Dot from '.'

export default {
  title: 'Data Display/Dot',
  component: Dot
} as Meta

export const Default: Story = () => (
  <>
    <Dot style={{ marginRight: '15px' }} />
    <Dot style={{ marginRight: '15px' }} type="success" />
    <Dot style={{ marginRight: '15px' }} type="warning" />
    <Dot type="error" />
  </>
)

export const Text: Story = () => (
  <>
    <Dot style={{ marginRight: '20px' }}>Canceled</Dot>
    <Dot style={{ marginRight: '20px' }} type="success">
      Ready
    </Dot>
    <Dot style={{ marginRight: '20px' }} type="warning">
      Warning
    </Dot>
    <Dot type="error">Error</Dot>
  </>
)
