import React from 'react'
import { Section, Container, Text, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'
import styles from './SectionFeatures.module.css'

function SectionFeatures() {
  const theme = useTheme()

  const themeEntries = [
    { label: 'type', value: theme.type, color: theme.palette.success },
    { label: 'primary', value: theme.palette.primary },
    { label: 'radius', value: theme.layout.radius },
    { label: 'font', value: theme.font.sans.split(',')[0].replace(/"/g, '') }
  ]

  const features = [
    {
      label: 'Customizable',
      tag: 'palette.primary',
      tagColor: theme.palette.primary,
      text: 'Change one token and every component follows.'
    },
    {
      label: 'Modern design',
      tag: Object.keys(theme.breakpoints).join(' · '),
      text: 'Responsive, theme-based style props for building design systems.'
    },
    {
      label: 'Well documented',
      tag: '51 / 51',
      tagColor: theme.palette.success,
      text: 'Every component has a live playground and a props table.'
    },
    {
      label: 'Fast loading',
      tag: 'sideEffects: false',
      text: 'ES modules, so your bundle only ships the components you import.'
    }
  ]

  return (
    <Section
      py={5}
      style={
        {
          '--features-border': theme.palette.border,
          '--features-radius': theme.layout.radius,
          '--features-bg': theme.palette.accents_1,
          '--features-mono': theme.font.mono,
          '--features-strong': theme.palette.accents_6,
          '--features-muted': theme.palette.accents_5
        } as React.CSSProperties
      }
    >
      <Container style={{ maxWidth: 1300 }}>
        <Eyebrow>
          <span style={{ color: theme.palette.accents_5 }}>
            One theme, every component
          </span>
        </Eyebrow>
        <Text h2 my={0} mb={2}>
          Set it once. Every component follows.
        </Text>
        <div className={styles.features}>
          <div className={styles.entry}>
            <span className={styles.entryTitle}>Theme</span>
            {themeEntries.map((entry) => (
              <div key={entry.label} className={styles.entryRow}>
                <span className={styles.muted}>{entry.label}</span>
                <span
                  style={{ color: entry.color || theme.palette.foreground }}
                >
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.rows}>
            {features.map((feature) => (
              <div key={feature.label} className={styles.row}>
                <span
                  className={styles.rowLabel}
                  style={{ color: theme.palette.warning }}
                >
                  {feature.label}
                </span>
                <span
                  className={styles.rowTag}
                  style={{ color: feature.tagColor || theme.palette.accents_5 }}
                >
                  {feature.tag}
                </span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default SectionFeatures
