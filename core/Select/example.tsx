import { useState } from 'react'
import Select from '.'

export default function Example() {
  const [value, setValue] = useState<string | string[]>('')

  return (
    <Select placeholder="Choose a plan" value={value} onChange={setValue}>
      <Select.Option value="free">Free</Select.Option>
      <Select.Option value="pro">Pro</Select.Option>
      <Select.Option value="team">Team</Select.Option>
    </Select>
  )
}
