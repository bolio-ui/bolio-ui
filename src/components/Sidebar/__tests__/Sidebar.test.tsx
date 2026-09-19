import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider } from 'core'
import Sidebar from '..'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/docs/components/badge',
    pathname: '/docs/components/badge',
    push: jest.fn()
  })
}))

const setup = () =>
  render(
    <BolioUIProvider>
      <Sidebar sidebar="components" />
    </BolioUIProvider>
  )

const scrollBox = (container: HTMLElement) =>
  container.querySelector('.box') as HTMLElement

describe('<Sidebar />', () => {
  it('keeps the scroll when it is created again on a new page', () => {
    const first = setup()
    scrollBox(first.container).scrollTop = 240
    fireEvent.scroll(scrollBox(first.container))
    first.unmount()

    const second = setup()
    expect(scrollBox(second.container).scrollTop).toBe(240)
  })

  it('shows the current page in bold inside a block, so it keeps its margin', () => {
    setup()
    const current = screen.getByText('Badge')
    expect(current.tagName).toBe('B')
    expect(current.parentElement?.tagName).toBe('P')
    expect(screen.getByText('Breadcrumbs').tagName).toBe('P')
  })
})
