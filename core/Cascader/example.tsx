import Cascader from '.'

const data = [
  {
    value: 'br',
    label: 'Brazil',
    children: [
      { value: 'sp', label: 'São Paulo' },
      { value: 'rj', label: 'Rio de Janeiro' }
    ]
  },
  { value: 'pt', label: 'Portugal' }
]

export default function Example() {
  return <Cascader aria-label="Place" data={data} placeholder="Pick a place" />
}
