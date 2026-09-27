import React from 'react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { act } from '@testing-library/react'
import { BolioUIProvider, Tabs } from '..'

// Tabs used to build its headers in effects, so the server HTML had none
it('Tabs renders its headers on the server and hydrates without a mismatch', async () => {
  const errors = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined)
  const ui = (
    <BolioUIProvider>
      <Tabs value="b" hideDivider hideBorder>
        <Tabs.Item label="A" value="a" font={2}>
          A
        </Tabs.Item>
        <>
          <Tabs.Item label={<b>B</b>} value="b" disabled>
            B
          </Tabs.Item>
        </>
      </Tabs>
    </BolioUIProvider>
  )
  const html = renderToString(ui)
  expect(html.match(/role="tab"/g)).toHaveLength(2)

  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  await act(async () => {
    hydrateRoot(container, ui)
  })
  expect(errors.mock.calls.map((c) => String(c[0]))).toEqual([])
  expect(container.querySelectorAll('[role="tab"]')).toHaveLength(2)
})
