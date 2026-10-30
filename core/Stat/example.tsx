import Card from '../Card'
import Stat from '.'

export default function Example() {
  return (
    <Card bordered>
      <Stat label="Revenue" value="$48,200" change="+12.4% this month" />
    </Card>
  )
}
