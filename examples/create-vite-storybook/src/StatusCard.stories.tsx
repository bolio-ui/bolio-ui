import type { Meta, StoryObj } from '@storybook/react-vite'
import StatusCard from './StatusCard.tsx'

const meta = {
  title: 'StatusCard',
  component: StatusCard,
  args: { title: 'API', children: 'Responding in under 200 ms.' },
  argTypes: {
    status: { control: 'inline-radio', options: ['success', 'warning', 'error'] }
  }
} satisfies Meta<typeof StatusCard>

export default meta
type Story = StoryObj<typeof meta>

export const Healthy: Story = { args: { status: 'success' } }

export const Degraded: Story = {
  args: { status: 'warning', children: 'Some requests are slow.' }
}

export const Down: Story = {
  args: { status: 'error', children: 'The service is not responding.' }
}
