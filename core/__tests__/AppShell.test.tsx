import React from 'react'
import { render, screen } from '@testing-library/react'
import { AppShell, BolioUIProvider } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('AppShell', () => {
  it('renders every slot as its landmark', () => {
    wrap(
      <AppShell>
        <AppShell.Header>Header</AppShell.Header>
        <AppShell.Navbar aria-label="Main">Navbar</AppShell.Navbar>
        <AppShell.Main>Main</AppShell.Main>
        <AppShell.Aside>Aside</AppShell.Aside>
        <AppShell.Footer>Footer</AppShell.Footer>
      </AppShell>
    )
    expect(screen.getByRole('banner')).toHaveTextContent('Header')
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveTextContent('Main')
    expect(screen.getByRole('complementary')).toHaveTextContent('Aside')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer')
  })

  it('places every slot in its grid area', () => {
    wrap(
      <AppShell>
        <AppShell.Header>Header</AppShell.Header>
        <AppShell.Main>Main</AppShell.Main>
      </AppShell>
    )
    expect(screen.getByRole('banner')).toHaveStyle({ gridArea: 'header' })
    expect(screen.getByRole('main')).toHaveStyle({ gridArea: 'main' })
  })

  it('sizes the shell and the slots', () => {
    const { container } = wrap(
      <AppShell height={300}>
        <AppShell.Header height={56}>Header</AppShell.Header>
        <AppShell.Navbar width={200}>Navbar</AppShell.Navbar>
      </AppShell>
    )
    expect(container.firstElementChild).toHaveStyle({ height: '300px' })
    expect(screen.getByRole('banner')).toHaveStyle({ height: '56px' })
    expect(screen.getByRole('navigation')).toHaveStyle({ width: '200px' })
  })

  it('forwards the ref to the root and the slots', () => {
    const root = React.createRef<HTMLDivElement>()
    const main = React.createRef<HTMLElement>()
    wrap(
      <AppShell ref={root}>
        <AppShell.Main ref={main}>Main</AppShell.Main>
      </AppShell>
    )
    expect(root.current?.tagName).toBe('DIV')
    expect(main.current?.tagName).toBe('MAIN')
  })
})
