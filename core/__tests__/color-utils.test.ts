import { hexToHsv, hsvToHex, normalizeHex } from '../ColorPicker/color-utils'

describe('normalizeHex', () => {
  it('accepts 3 and 6 digits, with or without #, in any case', () => {
    expect(normalizeHex('#AABBCC')).toBe('#aabbcc')
    expect(normalizeHex('aabbcc')).toBe('#aabbcc')
    expect(normalizeHex('#abc')).toBe('#aabbcc')
    expect(normalizeHex(' 0F0 ')).toBe('#00ff00')
  })

  it('rejects anything else', () => {
    ;['', '#', '#ab', '#abcd', '#abcde', '#abcdefg', '#ggg', 'red'].forEach(
      (text) => expect(normalizeHex(text)).toBeNull()
    )
  })
})

describe('hex and hsv', () => {
  it('converts the primaries and the grays', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 1, v: 1 })
    expect(hexToHsv('#00ff00')).toEqual({ h: 120, s: 1, v: 1 })
    expect(hexToHsv('#0000ff')).toEqual({ h: 240, s: 1, v: 1 })
    expect(hexToHsv('#ffffff')).toEqual({ h: 0, s: 0, v: 1 })
    expect(hexToHsv('#000000')).toEqual({ h: 0, s: 0, v: 0 })
    expect(hsvToHex({ h: 60, s: 1, v: 1 })).toBe('#ffff00')
    expect(hsvToHex({ h: 360, s: 1, v: 1 })).toBe('#ff0000')
    expect(hsvToHex({ h: 0, s: 0, v: 0.5 })).toBe('#808080')
  })

  it('takes an invalid hex as black', () => {
    expect(hexToHsv('nope')).toEqual({ h: 0, s: 0, v: 0 })
  })

  it('gives back every color it was given, over the whole space', () => {
    const steps = Array.from({ length: 16 }, (_, index) => index * 17)
    steps.forEach((r) =>
      steps.forEach((g) =>
        steps.forEach((b) => {
          const hex =
            '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
          expect(hsvToHex(hexToHsv(hex))).toBe(hex)
        })
      )
    )
  })
})
