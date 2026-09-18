import React from 'react'
import { render } from '@testing-library/react'
import { BolioUIProvider } from '..'
import { cases } from './cases'

describe('smoke: every component renders inside BolioUIProvider', () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it.each(cases)('%s', (_name, factory) => {
    const { container } = render(<BolioUIProvider>{factory()}</BolioUIProvider>)
    expect(container).toBeTruthy()
    // React warnings (deprecated APIs, invalid DOM props, ...) are surfaced
    // as failures so regressions during the React 19 / Next 16 upgrade show up.
    expect(errorSpy.mock.calls.map((call) => String(call[0]))).toEqual([])
  })
})
