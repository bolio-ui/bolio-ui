import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Button, useTheme } from '..'

describe('<Button />', () => {
  it('gets the focus ring color from the theme', () => {
    let primary = ''
    const Probe = () => {
      primary = useTheme().palette.primary
      return <Button>Save</Button>
    }
    render(
      <BolioUIProvider>
        <Probe />
      </BolioUIProvider>
    )
    expect(
      screen
        .getByRole('button')
        .style.getPropertyValue('--bolio-ui-button-focus')
    ).toBe(primary)
  })
})
