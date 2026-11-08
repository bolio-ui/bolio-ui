import { getButtonDripColor, getButtonHoverColors } from '../Button/styles'
import { getVariantColors } from '../utils/variant-colors'
import { palette as dark } from '../Themes/Presets/Dark'

describe('dark palette variants', () => {
  it('keeps every light variant color parseable by Button helpers', () => {
    for (const type of [
      'primary',
      'secondary',
      'success',
      'warning',
      'error',
      'info'
    ] as const) {
      expect(getVariantColors(dark, type, 'light').bg).toMatch(/^rgb\(/)
      const props = { type: `${type}-light` } as never
      expect(() => getButtonHoverColors(dark, props)).not.toThrow()
      expect(() => getButtonDripColor(dark, props)).not.toThrow()
    }
  })
})
