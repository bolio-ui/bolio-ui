'use client'

import React, { useMemo, useState } from 'react'
import {
  BolioUIProvider,
  ColorInput,
  Container,
  SegmentedControl,
  Section,
  Spacer,
  Text,
  Themes,
  useTheme
} from 'core'
import Base from 'src/templates/Base'
import { TABS, Tab } from 'src/components/ThemeGallery/Examples'
import {
  BASES,
  FONTS,
  mix,
  neutralsFor,
  OptionSelect,
  RADII
} from 'src/components/ThemeGallery/options'
import styles from './Themes.module.css'

const PRESETS: Record<string, { accent: string; base: string }> = {
  default: { accent: '#0072f6', base: 'default' },
  sunset: { accent: '#f5a525', base: 'warm' },
  forest: { accent: '#17c965', base: 'zinc' },
  berry: { accent: '#7828c9', base: 'slate' },
  ocean: { accent: '#06b7dc', base: 'ocean' },
  ember: { accent: '#f31261', base: 'rose' }
}

const Field: React.FC<React.PropsWithChildren<{ label: string }>> = ({
  label,
  children
}) => (
  <div className={styles.field}>
    <Text small b my={0}>
      {label}
    </Text>
    {children}
  </div>
)

export default function ThemesTemplate() {
  const pageTheme = useTheme()
  const [accent, setAccent] = useState('#0072f6')
  const [base, setBase] = useState('default')
  const [font, setFont] = useState('inter')
  const [radius, setRadius] = useState('medium')
  const [preset, setPreset] = useState('default')
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const [tab, setTab] = useState<Tab>('components')

  const applyPreset = (name: string) => {
    setPreset(name)
    setAccent(PRESETS[name].accent)
    setBase(PRESETS[name].base)
  }

  const theme = useMemo(() => {
    const dark = mode === 'dark'
    const neutrals = neutralsFor(BASES[base], dark)
    const create = dark ? Themes.createFromDark : Themes.createFromLight
    return create({
      type: `themes-preview-${mode}`,
      font: FONTS[font] ? { sans: FONTS[font] } : undefined,
      palette: {
        ...neutrals,
        primary: accent,
        primaryLighter: mix(accent, 255, 0.55),
        primaryLight: mix(accent, 255, 0.8),
        primaryDark: mix(accent, 0, 0.8)
      },
      layout: { radius: `${RADII[radius]}px` }
    })
  }, [accent, base, font, radius, mode])

  const Content = TABS[tab][1]

  return (
    <Base>
      <Section py={4}>
        <Container style={{ maxWidth: 1400, paddingInline: 24 }}>
          <Text h1>Theme Builder</Text>
          <Text p style={{ maxWidth: 640 }}>
            Shape the accent, base, font and radius, then check them on
            components and full screens.
          </Text>
          <Spacer h={1} />
          <div className={styles.controls}>
            <Field label="Accent">
              <ColorInput
                value={accent}
                onChange={(hex) => {
                  setAccent(hex)
                  setPreset('')
                }}
              />
            </Field>
            <Field label="Base">
              <OptionSelect
                value={base}
                options={Object.keys(BASES)}
                onChange={setBase}
              />
            </Field>
            <Field label="Font family">
              <OptionSelect
                value={font}
                options={Object.keys(FONTS)}
                onChange={setFont}
              />
            </Field>
            <Field label="Radius">
              <OptionSelect
                value={radius}
                options={Object.keys(RADII)}
                onChange={setRadius}
              />
            </Field>
            <Field label="Theme">
              <OptionSelect
                value={preset}
                options={Object.keys(PRESETS)}
                onChange={applyPreset}
              />
            </Field>
            <Field label="Mode">
              <SegmentedControl
                value={mode}
                onChange={(value) => setMode(value as 'light' | 'dark')}
                aria-label="Preview mode"
              >
                <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
                <SegmentedControl.Item value="light">
                  Light
                </SegmentedControl.Item>
              </SegmentedControl>
            </Field>
          </div>
          <Spacer h={1} />
          <div className={styles.tabs}>
            <SegmentedControl
              value={tab}
              onChange={(value) => setTab(value as Tab)}
              aria-label="Example"
            >
              {(Object.keys(TABS) as Array<Tab>).map((key) => (
                <SegmentedControl.Item key={key} value={key}>
                  {TABS[key][0]}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl>
          </div>
          <Spacer h={1} />
          <BolioUIProvider themes={[theme]} themeType={theme.type}>
            <PreviewSurface borderColor={pageTheme.palette.border}>
              <Content />
            </PreviewSurface>
          </BolioUIProvider>
        </Container>
      </Section>
    </Base>
  )
}

const PreviewSurface: React.FC<
  React.PropsWithChildren<{ borderColor: string }>
> = ({ borderColor, children }) => {
  const theme = useTheme()
  return (
    <div
      className={styles.surface}
      style={{
        background: theme.palette.background,
        color: theme.palette.foreground,
        fontFamily: theme.font.sans,
        borderColor
      }}
    >
      {children}
    </div>
  )
}
