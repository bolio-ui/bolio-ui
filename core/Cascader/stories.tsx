import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Cascader from '.'

export default {
  title: 'Data Entry/Cascader',
  component: Cascader
} as Meta

const data = [
  {
    value: 'br',
    label: 'Brazil',
    children: [
      {
        value: 'sp',
        label: 'São Paulo',
        children: [
          { value: 'sao-paulo', label: 'São Paulo' },
          { value: 'campinas', label: 'Campinas' }
        ]
      },
      { value: 'rj', label: 'Rio de Janeiro' }
    ]
  },
  { value: 'pt', label: 'Portugal' }
]

export const Default: StoryFn = () => (
  <Cascader aria-label="Place" data={data} placeholder="Pick a place" />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState<string[]>(['br', 'sp', 'campinas'])
  return (
    <Cascader
      aria-label="Place"
      data={data}
      value={value}
      onChange={setValue}
    />
  )
}
