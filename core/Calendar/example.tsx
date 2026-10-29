import { useState } from 'react'
import Calendar from '.'

export default function Example() {
  const [date, setDate] = useState(new Date())

  return <Calendar value={date} onChange={setDate} />
}
