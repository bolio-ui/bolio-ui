import Combobox from '.'

const countries = [
  { value: 'br', label: 'Brazil' },
  { value: 'pt', label: 'Portugal' },
  { value: 'us', label: 'United States' }
]

export default function Example() {
  return (
    <Combobox
      aria-label="Country"
      placeholder="Search a country"
      options={countries}
    />
  )
}
