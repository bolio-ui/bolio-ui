import { Story, Meta } from '@storybook/react'
import Keyboard from '.'

export default {
  title: 'Data Display/Keyboard',
  component: Keyboard
} as Meta

export const Default: Story = () => <Keyboard>C</Keyboard>

export const Modifiers: Story = () => (
  <>
    <Keyboard command mr="10px" />
    <Keyboard shift mr="10px" />
    <Keyboard option mr="10px" />
    <Keyboard ctrl mr="10px" />
  </>
)

export const Combination: Story = () => (
  <>
    <Keyboard command mr="10px">
      f
    </Keyboard>
    <Keyboard shift mr="10px">
      e
    </Keyboard>
    <Keyboard option ctrl mr="10px">
      b
    </Keyboard>
  </>
)
