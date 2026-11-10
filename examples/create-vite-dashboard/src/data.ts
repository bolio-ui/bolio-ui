import type { ScheduleEvent } from '@bolio-ui/core'

export const kpis = [
  {
    label: 'Visits',
    value: '24,300',
    change: '+12.4% this month',
    trend: [12, 14, 13, 18, 21, 24]
  },
  {
    label: 'Sign ups',
    value: '1,842',
    change: '+4.1% this month',
    trend: [8, 11, 9, 12, 13, 14]
  },
  {
    label: 'Churn',
    value: '1.8%',
    change: '-0.3% this month',
    trend: [3, 2.8, 2.6, 2.4, 2.1, 1.8]
  }
]

export const traffic = [
  { month: 'Jun', visits: 12000, signups: 820 },
  { month: 'Jul', visits: 14200, signups: 1010 },
  { month: 'Aug', visits: 13100, signups: 940 },
  { month: 'Sep', visits: 18300, signups: 1320 },
  { month: 'Oct', visits: 21400, signups: 1610 },
  { month: 'Nov', visits: 24300, signups: 1842 }
]

export const sources = [
  { name: 'Search', value: 5200 },
  { name: 'Direct', value: 3100 },
  { name: 'Social', value: 1800 },
  { name: 'Email', value: 900 }
]

export const pages = [
  { name: '/pricing', value: 12400 },
  { name: '/docs/getting-started', value: 9800 },
  { name: '/blog/launch', value: 6100 },
  { name: '/login', value: 3200 }
]

// Events around today, so the schedule always has something to show
const at = (day: number, hour: number, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + day)
  date.setHours(hour, minute, 0, 0)
  return date
}

export const events: ScheduleEvent[] = [
  { id: 1, title: 'Weekly review', start: at(0, 10), end: at(0, 11) },
  { id: 2, title: 'Launch call', start: at(1, 14), end: at(1, 15, 30), color: '#8b5cf6' },
  { id: 3, title: 'Campaign ends', start: at(2, 0), end: at(3, 0), allDay: true, color: '#f59e0b' }
]
