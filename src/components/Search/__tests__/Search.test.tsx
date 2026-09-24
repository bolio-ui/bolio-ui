import React from 'react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { act } from '@testing-library/react'
import { KBarProvider } from 'kbar'
import { BolioUIProvider } from 'core'
import InstantSearch from '../instant-search'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() })
}))

window.matchMedia = () =>
  ({
    matches: false,
    addListener: () => undefined,
    removeListener: () => undefined
  } as unknown as MediaQueryList)

it('search field is in the server HTML and hydrates cleanly', async () => {
  const errors = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined)
  const Provider = KBarProvider as unknown as React.FC<
    React.PropsWithChildren<{ actions: unknown[] }>
  >
  const ui = (
    <BolioUIProvider>
      <Provider actions={[]}>
        <InstantSearch />
      </Provider>
    </BolioUIProvider>
  )
  const html = renderToString(ui)
  expect(html).toContain('role="combobox"')
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  await act(async () => {
    hydrateRoot(container, ui)
  })
  expect(errors.mock.calls.map((c) => String(c[0]).slice(0, 200))).toEqual([])
})
