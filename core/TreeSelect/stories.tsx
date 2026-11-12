import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import TreeSelect from '.'

export default {
  title: 'Data Entry/TreeSelect',
  component: TreeSelect
} as Meta

const data = [
  {
    value: 'src',
    label: 'src',
    children: [
      { value: 'src/index.ts', label: 'index.ts' },
      { value: 'src/app.tsx', label: 'app.tsx' }
    ]
  },
  { value: 'README.md', label: 'README.md' }
]

export const Default: StoryFn = () => (
  <TreeSelect aria-label="File" data={data} placeholder="Pick a file" />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState<string | null>('src/app.tsx')
  return (
    <TreeSelect
      aria-label="File"
      data={data}
      value={value}
      onChange={setValue}
    />
  )
}
