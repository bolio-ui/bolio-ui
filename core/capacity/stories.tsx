import { Story, Meta } from '@storybook/react'
import useTheme from '../use-theme'
import Capacity from '.'
import Spacer from '../spacer'

export default {
  title: 'Data Display/Capacity',
  component: Capacity
} as Meta

export const Default: Story = () => (
  <>
    <Capacity value={15} /> <Spacer />
    <Capacity value={45} /> <Spacer />
    <Capacity value={95} />
  </>
)

export const FixedColor: Story = () => {
  const theme = useTheme()
  return <Capacity value={75} color={theme.palette.success} />
}
