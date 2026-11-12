import TreeSelect from '.'

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

export default function Example() {
  return <TreeSelect aria-label="File" data={data} placeholder="Pick a file" />
}
