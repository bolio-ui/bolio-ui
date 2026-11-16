import OverflowList from '.'
import Tag from '../Tag'

const tags = ['React', 'Next.js', 'Vite', 'Storybook', 'Vitest']

export default function Example() {
  return (
    <div style={{ width: 240 }}>
      <OverflowList
        data={tags}
        renderItem={(tag) => <Tag>{tag}</Tag>}
        renderOverflow={(hidden) => <Tag>+{hidden.length}</Tag>}
      />
    </div>
  )
}
