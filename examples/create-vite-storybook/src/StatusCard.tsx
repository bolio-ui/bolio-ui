import type { ReactNode } from 'react'
import { Badge, Card, Text } from '@bolio-ui/core'

export interface StatusCardProps {
  title: string
  status?: 'success' | 'warning' | 'error'
  children?: ReactNode
}

const labels = {
  success: 'Healthy',
  warning: 'Degraded',
  error: 'Down'
}

// A small component to write stories for: it takes props and uses a few
// Bolio UI components, so Storybook needs the provider and the stylesheet.
function StatusCard({ title, status = 'success', children }: StatusCardProps) {
  return (
    <Card width="100%">
      <Text h4 my={0}>
        {title}
      </Text>
      <Badge type={status}>{labels[status]}</Badge>
      {children && <Text>{children}</Text>}
    </Card>
  )
}

export default StatusCard
