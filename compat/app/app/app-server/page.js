// No 'use client' here on purpose: this is what a typical consumer writes.
import { BolioUIProvider, CssBaseline, Button, Card, Text } from '@bolio-ui/core'

export default function AppRouterServer() {
  return (
    <BolioUIProvider>
      <CssBaseline />
      <Card>
        <Text h3>App Router (server component)</Text>
        <Button type="secondary">Bolio button</Button>
      </Card>
    </BolioUIProvider>
  )
}
