import { useState } from 'react'
import Radio from '.'

export default function Example() {
  const [plan, setPlan] = useState('monthly')

  return (
    <Radio.Group value={plan} onChange={(value) => setPlan(String(value))}>
      <Radio value="monthly">Monthly</Radio>
      <Radio value="yearly">Yearly</Radio>
    </Radio.Group>
  )
}
