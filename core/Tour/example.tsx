import { useState } from 'react'
import Button from '../Button'
import Tour from '.'

const steps = [
  {
    target: '#tour-filter',
    title: 'Narrow the list',
    content: 'Filter by status, date or amount.'
  },
  {
    target: '#tour-export',
    title: 'Take it with you',
    content: 'Export the invoices you see as a CSV file.'
  }
]

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button id="tour-filter">Filters</Button>
      <Button id="tour-export">Export</Button>
      <Button onClick={() => setOpen(true)}>Take the tour</Button>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </>
  )
}
