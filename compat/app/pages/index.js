import {
  BolioUIProvider,
  CssBaseline,
  Button,
  Card,
  Text,
  Input
} from '@bolio-ui/core'

export default function PagesRouter() {
  return (
    <BolioUIProvider>
      <CssBaseline />
      <Card>
        <Text h3>Pages Router</Text>
        <Input placeholder="type here" />
        <Button type="secondary">Bolio button</Button>
      </Card>
    </BolioUIProvider>
  )
}
