'use client'

import {
  BolioUIProvider,
  CssBaseline,
  Button,
  Card,
  Text,
  Input
} from '@bolio-ui/core'

export default function AppRouterClient() {
  return (
    <BolioUIProvider>
      <CssBaseline />
      <Card>
        <Text h3>App Router (client component)</Text>
        <Input placeholder="type here" />
        <Button type="secondary">Bolio button</Button>
      </Card>
    </BolioUIProvider>
  )
}
