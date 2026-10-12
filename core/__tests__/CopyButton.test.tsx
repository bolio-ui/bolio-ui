import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, CopyButton } from '..'

const setup = (props: Partial<React.ComponentProps<typeof CopyButton>> = {}) =>
  render(
    <BolioUIProvider>
      <CopyButton value="yarn add @bolio-ui/core" {...props}>
        {({ copied, copy }) => (
          <button onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        )}
      </CopyButton>
    </BolioUIProvider>
  )

describe('<CopyButton />', () => {
  let execCommand: jest.Mock
  let copiedText: string[]

  beforeEach(() => {
    jest.useFakeTimers()
    copiedText = []
    execCommand = jest.fn(() => {
      copiedText.push(window.getSelection()?.toString() ?? '')
      return true
    })
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    Reflect.deleteProperty(document, 'execCommand')
  })

  it('renders only what the children draw', () => {
    const { container } = setup()
    expect(container.querySelectorAll('button')).toHaveLength(1)
  })

  it('copies the value and reports copied', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(copiedText).toEqual(['yarn add @bolio-ui/core'])
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('goes back to not copied after the timeout', () => {
    setup({ timeout: 500 })
    fireEvent.click(screen.getByRole('button'))
    act(() => {
      jest.advanceTimersByTime(499)
    })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
  })

  it('restarts the timeout on a second copy', () => {
    setup({ timeout: 500 })
    fireEvent.click(screen.getByRole('button'))
    act(() => {
      jest.advanceTimersByTime(400)
    })
    fireEvent.click(screen.getByRole('button'))
    act(() => {
      jest.advanceTimersByTime(400)
    })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })
})
