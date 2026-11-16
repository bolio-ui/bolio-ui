import { act, renderHook } from '@testing-library/react'
import { useActiveElement, useBrowserLanguage } from '..'

describe('useActiveElement', () => {
  it('follows the element that has focus', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    const { result } = renderHook(() => useActiveElement())
    expect(result.current).toBe(document.body)
    act(() => input.focus())
    expect(result.current).toBe(input)
    act(() => input.blur())
    expect(result.current).toBe(document.body)
    input.remove()
  })
})

describe('useBrowserLanguage', () => {
  it('reads the language of the browser and follows its changes', () => {
    const { result } = renderHook(() => useBrowserLanguage())
    expect(result.current).toBe(navigator.language)
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('pt-BR')
    act(() => {
      window.dispatchEvent(new Event('languagechange'))
    })
    expect(result.current).toBe('pt-BR')
  })
})
