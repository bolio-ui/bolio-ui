import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Popover from '.'
import Link from '../Link'
import Spacer from '../Spacer'
import Grid from '../Grid'

export default {
  title: 'Data Display/Popover',
  component: Popover
} as Meta

export const Default: Story = () => {
  const content = () => (
    <div style={{ padding: '0 10px' }}>
      <Link href="#">A hyperlink</Link>
      <Spacer h={0.5} />
      <Link color href="#">
        External link
      </Link>
    </div>
  )
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Popover content={content}>Menu</Popover>
      </Grid>
    </Grid.Container>
  )
}

export const PresetItem: Story = () => {
  const content = () => (
    <>
      <Popover.Item title>
        <span>User Settings</span>
      </Popover.Item>
      <Popover.Item>
        <Link href="#">A hyperlink</Link>
      </Popover.Item>
      <Popover.Item>
        <Link color href="#">
          A hyperlink for edit profile
        </Link>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <span>Command-Line</span>
      </Popover.Item>
    </>
  )
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Popover content={content}>Menu</Popover>
      </Grid>
    </Grid.Container>
  )
}

export const CloseManual: Story = () => {
  const [visible, setVisible] = useState(false)
  const changeHandler = (next) => {
    setVisible(next)
  }
  const content = () => (
    <div style={{ padding: '0 10px' }}>
      <span onClick={() => setVisible(false)}>Click to close</span>
      <Spacer h={0.5} />
      <span>Nothing</span>
    </div>
  )
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Popover
          content={content}
          visible={visible}
          onVisibleChange={changeHandler}
        >
          Menu
        </Popover>
      </Grid>
    </Grid.Container>
  )
}
