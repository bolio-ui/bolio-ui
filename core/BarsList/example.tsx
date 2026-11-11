import BarsList from '.'

export default function Example() {
  return (
    <BarsList
      barsLabel="Library"
      valueLabel="Downloads"
      data={[
        { name: 'React', value: 950000 },
        { name: 'Vue', value: 420000 },
        { name: 'Svelte', value: 120000 }
      ]}
    />
  )
}
