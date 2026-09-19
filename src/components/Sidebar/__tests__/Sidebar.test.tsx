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

  it('shows the current page like the others, only in bold', () => {
    setup()
    const current = screen.getByText('Badge')
    const other = screen.getByText('Breadcrumbs')

    // the same single element: a second one would repeat the margins and shift the text
    expect(current.tagName).toBe('P')
    expect(other.tagName).toBe('P')
    expect(current.querySelector('b')).toBeNull()
    expect(current.className).toBe(other.className)
    expect(current).toHaveStyle({ fontWeight: 'bold' })
    expect(other).not.toHaveStyle({ fontWeight: 'bold' })
  })
})
