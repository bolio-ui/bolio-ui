import React from 'react'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import {
  BolioUIProvider,
  CssBaseline,
  Modal,
  Drawer,
  Popover,
  Button
} from '..'

// Next.js with Cache Components fails the build of a page that reads
// Math.random() while it renders, so nothing may do it, not even to make an id.
describe('rendering does not read Math.random', () => {
  const tree = (
    <BolioUIProvider>
      <CssBaseline />
      <Button>Open</Button>
      <Modal visible={false} onClose={() => undefined} />
      <Drawer visible={false} onClose={() => undefined} placement="right" />
      <Popover content="Hi">
        <Button>Info</Button>
      </Popover>
    </BolioUIProvider>
  )

  it.each([
    ['on the server', () => renderToString(tree)],
    ['in the browser', () => render(tree)]
  ])('%s', (_name, run) => {
    const random = jest.spyOn(Math, 'random')
    run()
    expect(random).not.toHaveBeenCalled()
    random.mockRestore()
  })
})
