import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Tree from '.'
import type { TreeNodeData } from '.'

export default {
  title: 'Navigation/Tree',
  component: Tree
} as Meta

const data: Array<TreeNodeData> = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'components',
        label: 'components',
        children: [
          { value: 'button', label: 'Button.tsx' },
          { value: 'input', label: 'Input.tsx' }
        ]
      },
      { value: 'index', label: 'index.ts' }
    ]
  },
  { value: 'package', label: 'package.json' },
  { value: 'readme', label: 'README.md', disabled: true }
]

export const Default: StoryFn = () => (
  <Tree aria-label="Files" data={data} initialExpanded={['src']} />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = useState<string | null>('index')
  const [expanded, setExpanded] = useState<Array<string>>(['src'])
  return (
    <>
      <Tree
        aria-label="Files"
        data={data}
        value={value}
        onChange={setValue}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
      <p>Selected: {value}</p>
    </>
  )
}
