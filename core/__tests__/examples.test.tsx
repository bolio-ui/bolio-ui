import React from 'react'
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { render } from '@testing-library/react'
import { BolioUIProvider } from '..'

// `bolio-ui add` ships each example.tsx to the user's project, so every one
// has to render without React warnings
const root = join(__dirname, '..')
const names = readdirSync(root).filter((name) =>
  existsSync(join(root, name, 'example.tsx'))
)

describe('examples: every example.tsx renders', () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it.each(names)('%s', async (name) => {
    const { default: Example } = await import(join(root, name, 'example'))
    const { container } = render(
      <BolioUIProvider>
        <Example />
      </BolioUIProvider>
    )
    expect(container).toBeTruthy()
    expect(errorSpy.mock.calls.map((call) => String(call[0]))).toEqual([])
  })
})
