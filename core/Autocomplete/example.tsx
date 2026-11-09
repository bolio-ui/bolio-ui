import Autocomplete from '.'

export default function Example() {
  return (
    <Autocomplete
      aria-label="Fruit"
      placeholder="Type or pick a fruit"
      data={['Apple', 'Banana', 'Cherry', 'Grape']}
    />
  )
}
