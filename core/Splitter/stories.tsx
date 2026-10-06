import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Splitter from '.'

export default {
  title: 'Layout/Splitter',
  component: Splitter
} as Meta

const box = { height: 200, border: '1px solid', borderRadius: 8 }

export const Default: StoryFn = () => (
  <div style={box}>
    <Splitter>
      <Splitter.Panel defaultSize={30} minSize={15}>
        Sidebar
      </Splitter.Panel>
      <Splitter.Panel>Content</Splitter.Panel>
    </Splitter>
  </div>
)

export const Vertical: StoryFn = () => (
  <div style={box}>
    <Splitter direction="vertical">
      <Splitter.Panel>Editor</Splitter.Panel>
      <Splitter.Panel defaultSize={30}>Console</Splitter.Panel>
    </Splitter>
  </div>
)
