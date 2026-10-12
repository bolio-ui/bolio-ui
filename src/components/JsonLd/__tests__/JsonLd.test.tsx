import React from 'react'
import { render } from '@testing-library/react'
import JsonLd from '..'

describe('<JsonLd />', () => {
  it('writes the data as a JSON-LD script', () => {
    const { container } = render(
      <JsonLd data={{ '@type': 'WebSite', name: 'Bolio UI' }} />
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(JSON.parse(script?.innerHTML ?? '')).toEqual({
      '@type': 'WebSite',
      name: 'Bolio UI'
    })
  })

  it('cannot close the script tag from a value', () => {
    const { container } = render(<JsonLd data={{ name: '</script><b>' }} />)
    const script = container.querySelector('script')
    expect(script?.innerHTML).not.toContain('<')
    expect(JSON.parse(script?.innerHTML ?? '').name).toBe('</script><b>')
  })
})
