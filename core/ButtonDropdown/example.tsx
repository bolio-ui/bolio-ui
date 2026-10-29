import ButtonDropdown from '.'

export default function Example() {
  return (
    <ButtonDropdown>
      <ButtonDropdown.Item main>Publish</ButtonDropdown.Item>
      <ButtonDropdown.Item>Save as draft</ButtonDropdown.Item>
      <ButtonDropdown.Item>Schedule</ButtonDropdown.Item>
    </ButtonDropdown>
  )
}
