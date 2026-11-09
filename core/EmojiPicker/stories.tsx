import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import EmojiPicker from '.'

export default {
  title: 'Data Entry/EmojiPicker',
  component: EmojiPicker
} as Meta

const data = [
  {
    id: 'faces',
    label: 'Faces',
    emojis: [
      { emoji: '😀', name: 'grinning face', keywords: ['smile'] },
      { emoji: '😢', name: 'crying face', keywords: ['sad'] },
      { emoji: '😎', name: 'cool face', keywords: ['sunglasses'] },
      { emoji: '😴', name: 'sleeping face', keywords: ['tired'] }
    ]
  },
  {
    id: 'animals',
    label: 'Animals',
    emojis: [
      { emoji: '🐶', name: 'dog' },
      { emoji: '🐱', name: 'cat' },
      { emoji: '🦊', name: 'fox' }
    ]
  }
]

export const Default: StoryFn = () => <EmojiPicker data={data} columns={6} />

export const Picked: StoryFn = () => {
  const [picked, setPicked] = React.useState('')
  return (
    <>
      <p>Picked: {picked}</p>
      <EmojiPicker
        data={data}
        columns={6}
        onEmojiSelect={(item) => setPicked(item.emoji)}
      />
    </>
  )
}
