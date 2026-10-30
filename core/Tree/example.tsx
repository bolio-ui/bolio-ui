import Tree from '.'

const data = [
  {
    value: 'src',
    label: 'src',
    children: [
      { value: 'button', label: 'Button.tsx' },
      { value: 'index', label: 'index.ts' }
    ]
  },
  { value: 'package', label: 'package.json' }
]

export default function Example() {
  return (
    <Tree aria-label="Project files" initialExpanded={['src']} data={data} />
  )
}
