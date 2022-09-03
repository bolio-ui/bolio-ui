import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import useTheme from '../use-theme'
import Progress from '.'
import Spacer from '../spacer'
import Button from '../button'

export default {
  title: 'Feedback/Progress',
  component: Progress
} as Meta

export const Default: Story = () => <Progress value={50} />

export const CustomMax: Story = () => <Progress value={45} max={50} />

export const DynamicColors: Story = () => {
  const theme = useTheme()

  const [value, setValue] = useState(20)

  const colors = {
    20: theme.palette.error,
    40: theme.palette.warning,
    60: theme.palette.success,
    80: '#000'
  }

  return (
    <>
      <Progress value={value} colors={colors} />
      <Spacer />
      <Button onClick={() => setValue(value + 20)} auto scale={0.5}>
        Add
      </Button>
      <Spacer w={0.5} inline />
      <Button onClick={() => setValue(20)} auto scale={0.5} type="error">
        Remove
      </Button>
    </>
  )
}

export const Type: Story = () => (
  <>
    <Progress type="secondary" value={10} />
    <Spacer />
    <Progress type="success" value={45} />
    <Spacer />
    <Progress type="warning" value={100} />
    <Spacer />
    <Progress type="error" value={21} />
  </>
)
