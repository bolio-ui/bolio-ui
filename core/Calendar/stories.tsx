import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import Calendar from '.'
import Text from '../Text'

export default {
  title: 'Data Entry/Calendar',
  component: Calendar
} as Meta

export const Default: Story = () => {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <>
      <Calendar value={date} onChange={setDate} />
      <Text small>Selected: {date ? date.toDateString() : 'none'}</Text>
    </>
  )
}

export const MinAndMax: Story = () => {
  const today = new Date()
  const min = new Date(today.getFullYear(), today.getMonth(), 5)
  const max = new Date(today.getFullYear(), today.getMonth(), 25)
  return <Calendar min={min} max={max} />
}

export const Portuguese: Story = () => (
  <Calendar locale="pt-BR" weekStartsOn={1} />
)
