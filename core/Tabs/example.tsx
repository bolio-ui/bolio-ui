import Tabs from '.'

export default function Example() {
  return (
    <Tabs initialValue="1">
      <Tabs.Item label="Overview" value="1">
        A summary of your account.
      </Tabs.Item>
      <Tabs.Item label="Billing" value="2">
        Your invoices and payment methods.
      </Tabs.Item>
    </Tabs>
  )
}
