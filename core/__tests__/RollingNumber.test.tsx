import { render } from '@testing-library/react'
import { BolioUIProvider, RollingNumber } from '..'

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>)

describe('<RollingNumber />', () => {
  it('names the formatted number for assistive technology', () => {
    const { getByRole } = draw(<RollingNumber value={1280} locale="en-US" />)
    expect(getByRole('img').getAttribute('aria-label')).toBe('1,280')
  })

  it('formats with the options it is given', () => {
    const { getByRole } = draw(
      <RollingNumber
        value={4820.5}
        locale="en-US"
        formatOptions={{ style: 'currency', currency: 'USD' }}
      />
    )
    expect(getByRole('img').getAttribute('aria-label')).toBe('$4,820.50')
  })

  it('rolls each digit to its place', () => {
    const { container } = draw(<RollingNumber value={305} locale="en-US" />)
    const strips = Array.from(
      container.querySelectorAll<HTMLElement>('span[aria-hidden] > span')
    ).map((strip) => strip.style.transform)
    expect(strips).toEqual([
      'translateY(-3em)',
      'translateY(-0em)',
      'translateY(-5em)'
    ])
  })

  it('moves the digits when the value changes', () => {
    const { container, rerender } = draw(
      <RollingNumber value={10} locale="en-US" />
    )
    rerender(
      <BolioUIProvider>
        <RollingNumber value={19} locale="en-US" />
      </BolioUIProvider>
    )
    const strips = Array.from(
      container.querySelectorAll<HTMLElement>('span[aria-hidden] > span')
    ).map((strip) => strip.style.transform)
    expect(strips).toEqual(['translateY(-1em)', 'translateY(-9em)'])
  })
})
