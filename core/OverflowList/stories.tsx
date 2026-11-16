import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import OverflowList from '.'
import Tag from '../Tag'

export default {
  title: 'Layout/OverflowList',
  component: OverflowList
} as Meta

const tags = ['React', 'Next.js', 'Vite', 'Storybook', 'Vitest']

export const Default: StoryFn = () => (
  <div style={{ width: 240 }}>
    <OverflowList
      data={tags}
      renderItem={(tag) => <Tag>{tag}</Tag>}
      renderOverflow={(hidden) => <Tag>+{hidden.length}</Tag>}
    />
  </div>
)
