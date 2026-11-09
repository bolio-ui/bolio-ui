import EmojiPicker from '.'

const data = [
  {
    id: 'faces',
    label: 'Faces',
    emojis: [
      { emoji: '😀', name: 'grinning face', keywords: ['smile', 'happy'] },
      { emoji: '😢', name: 'crying face', keywords: ['sad'] },
      { emoji: '😎', name: 'cool face', keywords: ['sunglasses'] }
    ]
  },
  {
    id: 'animals',
    label: 'Animals',
    emojis: [
      { emoji: '🐶', name: 'dog' },
      { emoji: '🐱', name: 'cat' }
    ]
  }
]

export default function Example() {
  return <EmojiPicker data={data} columns={5} height={220} />
}
