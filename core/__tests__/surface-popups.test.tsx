import React from 'react'
import { render } from '@testing-library/react'
import { BolioUIProvider, DatePicker, DateRangePicker, Themes } from '..'

const popupHover = (themeType: string, ui: React.ReactElement) => {
  const view = render(
    <BolioUIProvider themeType={themeType}>{ui}</BolioUIProvider>
  )
  const root = view.container.querySelector<HTMLElement>(
    '[style*="--calendar-popup-hover"]'
  )
  const value = root?.style.getPropertyValue('--calendar-popup-hover')
  view.unmount()
  return value
}

describe('popups around a Calendar', () => {
  const [light, dark] = Themes.getPresets()

  it.each([
    ['DatePicker', <DatePicker key="a" />],
    ['DateRangePicker', <DateRangePicker key="b" />]
  ])('%s sets the hover of its Calendar from the surface', (_, ui) => {
    expect(popupHover('light', ui)).toBe(light.palette.accents_2)
    expect(popupHover('dark', ui)).toBe(dark.palette.accents_4)
  })
})
