export interface Hsv {
  // 0 to 360
  h: number
  // 0 to 1
  s: number
  // 0 to 1
  v: number
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

// "#abc", "abc", "#aabbcc" and "aabbcc" give "#aabbcc"; anything else is null
export const normalizeHex = (text: string): string | null => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text.trim())
  if (!match) return null
  const digits = match[1].toLowerCase()
  const full =
    digits.length === 3
      ? digits
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : digits
  return `#${full}`
}

export const hexToHsv = (hex: string): Hsv => {
  const value = normalizeHex(hex) || '#000000'
  const [r, g, b] = [1, 3, 5].map(
    (start) => parseInt(value.slice(start, start + 2), 16) / 255
  )
  const max = Math.max(r, g, b)
  const delta = max - Math.min(r, g, b)
  let h = 0
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h = (h * 60 + 360) % 360
  }
  return { h, s: max ? delta / max : 0, v: max }
}

export const hsvToHex = ({ h, s, v }: Hsv): string => {
  const hue = (((h % 360) + 360) % 360) / 60
  const chroma = v * s
  const x = chroma * (1 - Math.abs((hue % 2) - 1))
  const [r, g, b] = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x]
  ][Math.min(5, Math.floor(hue))]
  const shift = v - chroma
  return (
    '#' +
    [r, g, b]
      .map((channel) =>
        Math.round(clamp(channel + shift) * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

export { clamp }
