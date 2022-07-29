import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Page from '.'
import Button from '../button'
import MockPage from '../mdx-widgets/mock-page'

export default {
  title: 'Layout/Page',
  component: Page
} as Meta

export const Default: Story = () => {
  const Child = () => (
    <>
      <h2>Hi my dear!</h2>
      <p>This is an example to show the body of a page.</p>
    </>
  )
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)} auto>
        View Page
      </Button>
      <MockPage visible={visible} onClose={() => setVisible(false)}>
        <Page>
          <Child />
        </Page>
      </MockPage>
    </>
  )
}

export const Content: Story = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <Button onClick={() => setVisible(true)} auto>
        Header, Body and Footer
      </Button>
      <MockPage visible={visible} onClose={() => setVisible(false)}>
        <Page>
          <Page.Header>
            <h2>Header</h2>
          </Page.Header>
          <Page.Content>
            <h2>Hi my dear!</h2>
            <p>This is an example to show the body of a page.</p>
          </Page.Content>
          <Page.Footer>
            <h2>Footer</h2>
          </Page.Footer>
        </Page>
      </MockPage>
    </>
  )
}
