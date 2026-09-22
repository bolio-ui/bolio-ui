import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  BolioUIProvider,
  BolioUIThemes,
  Button,
  ButtonProps,
  Snippet,
  Text,
  Themes,
  useClickAway,
  useClipboard,
  useTheme,
  useToasts
} from 'core'

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)))

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  const bigint = parseInt(normalized, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (value: number) => clamp(value).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

// Picks black or white text for a given background, so labels stay readable
// across the whole lightness range instead of relying on a blend mode.
const getReadableTextColor = (hex: string) => {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#000' : '#fff'
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type Hsv = { h: number; s: number; v: number }

const rgbToHsv = (r: number, g: number, b: number): Hsv => {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255]
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const d = max - min

  let h = 0
  if (d !== 0) {
    if (max === rr) h = 60 * (((gg - bb) / d) % 6)
    else if (max === gg) h = 60 * ((bb - rr) / d + 2)
    else h = 60 * ((rr - gg) / d + 4)
  }
  if (h < 0) h += 360

  return { h, s: max === 0 ? 0 : d / max, v: max }
}

const hsvToRgb = ({ h, s, v }: Hsv) => {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  const [r1, g1, b1] =
    h < 60
      ? [c, x, 0]
      : h < 120
      ? [x, c, 0]
      : h < 180
      ? [0, c, x]
      : h < 240
      ? [0, x, c]
      : h < 300
      ? [x, 0, c]
      : [c, 0, x]

  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 }
}

const hexToHsv = (hex: string): Hsv => {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsv(r, g, b)
}

const hsvToHex = (hsv: Hsv) => {
  const { r, g, b } = hsvToRgb(hsv)
  return rgbToHex(r, g, b)
}

// Mixes a color towards white (target 255) or black (target 0), keeping the hue.
const mix = (hex: string, target: number, ratio: number) => {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(
    r + (target - r) * ratio,
    g + (target - g) * ratio,
    b + (target - b) * ratio
  )
}

// Same idea as Mantine's shade scale: 10 stops from near white (0) to near
// black (9), with the color the user typed sitting untouched at index 6.
const SHADE_RATIOS = [0.92, 0.8, 0.68, 0.55, 0.4, 0.22, 0, 0.28, 0.55, 0.8]

const buildShades = (hex: string): Array<string> =>
  SHADE_RATIOS.map((ratio, index) => {
    if (index === 6) return hex.toUpperCase()
    return index < 6 ? mix(hex, 255, ratio) : mix(hex, 0, ratio)
  })

// The only 4 stops Bolio UI themes actually use.
const TOKEN_SHADE_INDEX = { light: 1, lighter: 3, base: 6, dark: 9 } as const

const buildPalette = (primary: string, secondary: string) => {
  const primaryShades = buildShades(primary)
  const secondaryShades = buildShades(secondary)

  return {
    primary: primaryShades[TOKEN_SHADE_INDEX.base],
    primaryLighter: primaryShades[TOKEN_SHADE_INDEX.lighter],
    primaryLight: primaryShades[TOKEN_SHADE_INDEX.light],
    primaryDark: primaryShades[TOKEN_SHADE_INDEX.dark],
    secondary: secondaryShades[TOKEN_SHADE_INDEX.base],
    secondaryLighter: secondaryShades[TOKEN_SHADE_INDEX.lighter],
    secondaryLight: secondaryShades[TOKEN_SHADE_INDEX.light],
    secondaryDark: secondaryShades[TOKEN_SHADE_INDEX.dark]
  }
}

const TOKEN_LABEL_BY_INDEX: Record<number, string> = {
  1: 'Light',
  3: 'Lighter',
  6: 'Base',
  9: 'Dark'
}

type PresetPair = { name: string; primary: string; secondary: string }

// Curated pairs, not a hue wheel: each one is a primary/secondary duo that
// already works together, so picking a preset never leaves you with a clash.
const PRESETS: Array<PresetPair> = [
  { name: 'Bolio Blue', primary: '#0072F6', secondary: '#7828C9' },
  { name: 'Sunset', primary: '#F5A525', secondary: '#F31261' },
  { name: 'Forest', primary: '#17C965', secondary: '#0072F6' },
  { name: 'Berry', primary: '#7828C9', secondary: '#F31261' },
  { name: 'Ocean', primary: '#06B7DC', secondary: '#0072F6' },
  { name: 'Ember', primary: '#F31261', secondary: '#F5A525' },
  { name: 'Grape', primary: '#7828C9', secondary: '#06B7DC' },
  { name: 'Mint', primary: '#17C965', secondary: '#06B7DC' },
  { name: 'Slate', primary: '#444444', secondary: '#0072F6' },
  { name: 'Rose', primary: '#F31261', secondary: '#7828C9' },
  { name: 'Lagoon', primary: '#4ECDC4', secondary: '#0072F6' },
  { name: 'Plum', primary: '#7828C9', secondary: '#F5A525' },
  { name: 'Coral', primary: '#FF6B6B', secondary: '#06B7DC' },
  { name: 'Citrus', primary: '#F5A525', secondary: '#17C965' },
  { name: 'Midnight', primary: '#111111', secondary: '#0072F6' },
  { name: 'Jade Sky', primary: '#0072F6', secondary: '#2EC4B6' },
  { name: 'Wine', primary: '#F31261', secondary: '#444444' },
  { name: 'Lime', primary: '#17C965', secondary: '#FFD166' },
  { name: 'Indigo', primary: '#9013FE', secondary: '#0072F6' },
  { name: 'Amber', primary: '#F5A525', secondary: '#264653' },
  { name: 'Teal', primary: '#2EC4B6', secondary: '#7828C9' },
  { name: 'Cherry', primary: '#E63946', secondary: '#17C965' },
  { name: 'Steel', primary: '#444444', secondary: '#06B7DC' },
  { name: 'Violet', primary: '#9013FE', secondary: '#F31261' },
  { name: 'Gold', primary: '#FF8C42', secondary: '#7828C9' }
]

const ShadeStrip: React.FC<{ hex: string; compact?: boolean }> = ({
  hex,
  compact = false
}) => {
  const theme = useTheme()
  const shades = useMemo(() => buildShades(hex), [hex])

  return (
    <div className="strip">
      {shades.map((shade, index) => {
        const label = TOKEN_LABEL_BY_INDEX[index]
        const isBase = index === 6
        const textColor = getReadableTextColor(shade)
        return (
          <div
            key={`${shade}-${index}`}
            className={`tile ${isBase ? 'active' : ''}`}
            style={{ background: shade, color: textColor }}
            title={`${label ? `${label} · ` : ''}${shade}`}
          >
            <span className="index">{index}</span>
            {!compact && label && <span className="label">{label}</span>}
          </div>
        )
      })}
      <style jsx>{`
        .strip {
          display: flex;
          width: 100%;
          border-radius: ${theme.layout.radius};
          overflow: hidden;
          border: 1px solid ${theme.palette.border};
        }
        .tile {
          flex: 1;
          min-width: 0;
          height: ${compact ? '48px' : '96px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          position: relative;
        }
        .tile.active {
          box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.9);
          z-index: 1;
        }
        .index {
          font-size: ${compact ? '12px' : '16px'};
          font-weight: 700;
          color: inherit;
        }
        .label {
          font-size: 11px;
          font-weight: 600;
          color: inherit;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  )
}

const SectionHeading: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const theme = useTheme()
  return (
    <Text small style={{ color: theme.palette.accents_5 }}>
      {children}
    </Text>
  )
}

// A saturation/value square plus a hue bar, dragged with native Pointer
// Events (setPointerCapture keeps the drag going outside the element bounds).
const ColorPickerPanel: React.FC<{
  value: string
  onChange: (hex: string) => void
}> = ({ value, onChange }) => {
  const theme = useTheme()
  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const hsv = useMemo(() => hexToHsv(value), [value])

  const updateFromSV = (clientX: number, clientY: number) => {
    const el = svRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const s = clamp01((clientX - rect.left) / rect.width)
    const v = 1 - clamp01((clientY - rect.top) / rect.height)
    onChange(hsvToHex({ h: hsv.h, s, v }))
  }

  const updateFromHue = (clientX: number) => {
    const el = hueRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const h = clamp01((clientX - rect.left) / rect.width) * 360
    onChange(hsvToHex({ h, s: hsv.s, v: hsv.v }))
  }

  const svPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromSV(event.clientX, event.clientY)
  }
  const svPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return
    updateFromSV(event.clientX, event.clientY)
  }
  const huePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromHue(event.clientX)
  }
  const huePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return
    updateFromHue(event.clientX)
  }

  return (
    <div className="picker-panel">
      <div
        ref={svRef}
        className="sv"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h}, 100%, 50%)`
        }}
        onPointerDown={svPointerDown}
        onPointerMove={svPointerMove}
      >
        <span
          className="handle"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
        />
      </div>
      <div
        ref={hueRef}
        className="hue"
        onPointerDown={huePointerDown}
        onPointerMove={huePointerMove}
      >
        <span
          className="handle"
          style={{ left: `${(hsv.h / 360) * 100}%`, top: '50%' }}
        />
      </div>
      <style jsx>{`
        .picker-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 220px;
        }
        .sv {
          position: relative;
          width: 100%;
          height: 140px;
          border-radius: ${theme.layout.radius};
          cursor: crosshair;
          touch-action: none;
        }
        .hue {
          position: relative;
          width: 100%;
          height: 14px;
          border-radius: 100px;
          cursor: pointer;
          touch-action: none;
          background: linear-gradient(
            to right,
            #f00,
            #ff0,
            #0f0,
            #0ff,
            #00f,
            #f0f,
            #f00
          );
        }
        .handle {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

const ColorField: React.FC<{
  label: string
  value: string
  onChange: (hex: string) => void
}> = ({ label, value, onChange }) => {
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)

  useClickAway(containerRef, () => setOpen(false))

  useEffect(() => {
    setDraft(value)
  }, [value])

  const commitDraft = () => {
    if (HEX_PATTERN.test(draft)) onChange(draft.toUpperCase())
    else setDraft(value)
  }

  return (
    <div className="field" ref={containerRef}>
      <button
        type="button"
        className="swatch"
        style={{ background: value }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Pick the ${label} color`}
      />
      <div className="info">
        <Text small style={{ color: theme.palette.accents_5 }}>
          {label}
        </Text>
        <input
          className="hex-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => event.key === 'Enter' && commitDraft()}
          aria-label={`${label} hex color`}
        />
      </div>
      {open && (
        <div className="popover">
          <ColorPickerPanel value={value} onChange={onChange} />
        </div>
      )}
      <style jsx>{`
        .field {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .swatch {
          width: 44px;
          height: 44px;
          padding: 0;
          border: 2px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          cursor: pointer;
        }
        .hex-input {
          width: 96px;
          padding: 2px 0;
          border: none;
          background: none;
          color: ${theme.palette.foreground};
          font-weight: 600;
          font-size: 14px;
        }
        .hex-input:focus {
          outline: none;
        }
        .popover {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          z-index: 50;
          padding: 12px;
          background: ${theme.palette.background};
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          box-shadow: ${theme.expressiveness.shadowMedium};
        }
      `}</style>
    </div>
  )
}

// Shared box that carries the current theme's background/foreground/border,
// so nested previews read correctly no matter what page theme sits behind them.
const ThemeBox: React.FC<React.PropsWithChildren<{ label: string }>> = ({
  label,
  children
}) => {
  const theme = useTheme()

  return (
    <div
      className="theme-box"
      style={{
        background: theme.palette.background,
        color: theme.palette.foreground,
        borderColor: theme.palette.border
      }}
    >
      <Text small style={{ color: theme.palette.accents_5 }}>
        {label}
      </Text>
      {children}
      <style jsx>{`
        .theme-box {
          border: 1px solid;
          border-radius: 8px;
          padding: 16px;
        }
      `}</style>
    </div>
  )
}

const VARIANT_ROWS: Array<{
  label: string
  type: 'primary' | 'secondary'
}> = [
  { label: 'Primary', type: 'primary' },
  { label: 'Secondary', type: 'secondary' }
]

const VariantsPreview: React.FC = () => {
  const theme = useTheme()

  return (
    <div className="variants">
      <div className="variants-header">
        <span />
        <span>Filled</span>
        <span>Light</span>
        <span>Outline</span>
        <span>Subtle</span>
      </div>
      {VARIANT_ROWS.map((row) => (
        <div className="variants-row" key={row.type}>
          <Text small style={{ color: theme.palette.accents_5 }}>
            {row.label}
          </Text>
          <Button type={row.type} auto scale={0.7}>
            Button
          </Button>
          <Button
            type={`${row.type}-light` as ButtonProps['type']}
            auto
            scale={0.7}
          >
            Button
          </Button>
          <Button type={row.type} ghost auto scale={0.7}>
            Button
          </Button>
          <Button type={row.type} subtle auto scale={0.7}>
            Button
          </Button>
        </div>
      ))}
      <style jsx>{`
        .variants {
          margin-top: 12px;
        }
        .variants-header,
        .variants-row {
          display: grid;
          grid-template-columns: 88px repeat(4, 1fr);
          gap: 12px;
          align-items: center;
        }
        .variants-header {
          margin-bottom: 8px;
        }
        .variants-header span {
          font-size: 12px;
          font-weight: 600;
          color: ${theme.palette.accents_5};
          text-transform: uppercase;
        }
        .variants-row {
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  )
}

interface ThemeGeneratorProps {
  // Trims the heavier sections (variants preview, usage code) and shrinks the
  // shade strips, for embedding inline in a docs page instead of a full one.
  compact?: boolean
}

const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({ compact = false }) => {
  const theme = useTheme()
  const router = useRouter()
  const { copy } = useClipboard()
  const { setToast } = useToasts()

  const [primary, setPrimary] = useState(theme.palette.primary)
  const [secondary, setSecondary] = useState(theme.palette.secondary)

  // A preset or a shared link can set both colors at once, so state updates
  // don't race the query-string sync effect below.
  useEffect(() => {
    if (!router.isReady) return
    const { primary: queryPrimary, secondary: querySecondary } = router.query
    if (typeof queryPrimary === 'string' && HEX_PATTERN.test(queryPrimary)) {
      setPrimary(queryPrimary.toUpperCase())
    }
    if (
      typeof querySecondary === 'string' &&
      HEX_PATTERN.test(querySecondary)
    ) {
      setSecondary(querySecondary.toUpperCase())
    }
    // Only read the query string once, when the page lands with one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const applyPreset = (preset: PresetPair) => {
    setPrimary(preset.primary)
    setSecondary(preset.secondary)
  }

  const palette = useMemo(
    () => buildPalette(primary, secondary),
    [primary, secondary]
  )

  const lightPreviewTheme = useMemo<BolioUIThemes>(
    () =>
      Themes.createFromLight({
        type: 'theme-generator-preview-light',
        palette
      }),
    [palette]
  )

  const darkPreviewTheme = useMemo<BolioUIThemes>(
    () =>
      Themes.createFromDark({
        type: 'theme-generator-preview-dark',
        palette
      }),
    [palette]
  )

  const code = useMemo(
    () => [
      "import { Themes } from '@bolio-ui/core'",
      '',
      'const myTheme = Themes.createFromLight({',
      "  type: 'my-theme',",
      '  palette: {',
      `    primary: '${palette.primary}',`,
      `    primaryLighter: '${palette.primaryLighter}',`,
      `    primaryLight: '${palette.primaryLight}',`,
      `    primaryDark: '${palette.primaryDark}',`,
      `    secondary: '${palette.secondary}',`,
      `    secondaryLighter: '${palette.secondaryLighter}',`,
      `    secondaryLight: '${palette.secondaryLight}',`,
      `    secondaryDark: '${palette.secondaryDark}'`,
      '  }',
      '})'
    ],
    [palette]
  )

  const copyUrl = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('primary', primary)
    url.searchParams.set('secondary', secondary)
    copy(url.toString())
    setToast({ text: 'Link copied!', type: 'success' })
  }

  const copyCode = () => {
    copy(code.join('\n'))
    setToast({ text: 'Code copied!', type: 'success' })
  }

  return (
    <div className="theme-generator">
      <div className="section fields">
        <ColorField label="Primary" value={primary} onChange={setPrimary} />
        <ColorField
          label="Secondary"
          value={secondary}
          onChange={setSecondary}
        />
        {!compact && (
          <Button auto scale={0.75} onClick={copyUrl}>
            Copy URL
          </Button>
        )}
      </div>

      <div className="section">
        <SectionHeading>Presets</SectionHeading>
        <div className="presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              className="preset"
              onClick={() => applyPreset(preset)}
              aria-label={`Use the ${preset.name} preset`}
            >
              <span
                className="swatch"
                style={{
                  background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.secondary} 50%)`
                }}
              />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <SectionHeading>Shades</SectionHeading>
        <div className="shade-strips">
          <ShadeStrip hex={primary} compact={compact} />
          <ShadeStrip hex={secondary} compact={compact} />
        </div>
      </div>

      {!compact && (
        <div className="section">
          <SectionHeading>Variants preview</SectionHeading>
          <div className="variants-preview">
            <BolioUIProvider
              themes={[lightPreviewTheme]}
              themeType="theme-generator-preview-light"
            >
              <ThemeBox label="Light">
                <VariantsPreview />
              </ThemeBox>
            </BolioUIProvider>
            <BolioUIProvider
              themes={[darkPreviewTheme]}
              themeType="theme-generator-preview-dark"
            >
              <ThemeBox label="Dark">
                <VariantsPreview />
              </ThemeBox>
            </BolioUIProvider>
          </div>
        </div>
      )}

      {!compact && (
        <div className="section">
          <div className="code-header">
            <SectionHeading>Usage with BolioUIProvider</SectionHeading>
            <Button auto scale={0.6} type="abort" onClick={copyCode}>
              Copy
            </Button>
          </div>
          <Snippet text={code} symbol="" width="100%" />
        </div>
      )}

      <style jsx>{`
        .section {
          margin-top: calc(${theme.layout.gap} * ${compact ? 1 : 2});
        }
        .section:first-child {
          margin-top: 0;
        }
        .fields {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 24px;
        }
        .shade-strips {
          display: flex;
          flex-direction: column;
          gap: ${theme.layout.gapHalf};
          margin-top: ${theme.layout.gapHalf};
        }
        .variants-preview {
          display: flex;
          flex-direction: column;
          gap: ${theme.layout.gapHalf};
          margin-top: ${theme.layout.gapHalf};
        }
        .presets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: ${theme.layout.gapHalf};
        }
        .preset {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px 6px 6px;
          border: 1px solid ${theme.palette.border};
          border-radius: 100px;
          background: none;
          color: ${theme.palette.foreground};
          font-size: 13px;
          cursor: pointer;
        }
        .preset:hover {
          border-color: ${theme.palette.accents_4};
        }
        .swatch {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: ${theme.layout.gapHalf};
        }
      `}</style>
    </div>
  )
}

export default ThemeGenerator
