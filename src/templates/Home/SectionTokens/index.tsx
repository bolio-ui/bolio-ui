import React from 'react'
import { Section, Container, Text, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'
import styles from './SectionTokens.module.css'

const tokens = [
  'background',
  'accents_1',
  'accents_2',
  'accents_3',
  'accents_4',
  'accents_5',
  'accents_6',
  'accents_7',
  'accents_8',
  'foreground',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info'
] as const

// First family of a font stack, e.g. '"Inter", -apple-system' -> 'Inter'.
const familyName = (stack: string) => stack.split(',')[0].replace(/"/g, '')

function SectionTokens() {
  const theme = useTheme()

  return (
    <Section
      py={5}
      style={
        {
          '--tokens-count': tokens.length,
          '--tokens-border': theme.palette.border,
          '--tokens-radius': theme.layout.radius,
          '--tokens-mono': theme.font.mono,
          '--tokens-muted': theme.palette.accents_5,
          '--tokens-foreground': theme.palette.foreground
        } as React.CSSProperties
      }
    >
      <Container style={{ maxWidth: 1300 }}>
        <Eyebrow>
          <span style={{ color: theme.palette.accents_5 }}>Make it yours</span>
        </Eyebrow>
        <Text h2 my={0} mb={2}>
          Sixteen colors and two typefaces.
        </Text>
        <div className={styles.swatches}>
          {tokens.map((token) => (
            <span
              key={token}
              className={styles.swatch}
              title={`palette.${token}`}
              style={{ backgroundColor: theme.palette[token] }}
            />
          ))}
        </div>
        <p className={styles.note}>
          Every component uses one of these. Change a token in your theme, the
          whole app follows.
        </p>
        <div className={styles.typefaces}>
          <div>
            <span
              className={styles.typeface}
              style={{ fontFamily: theme.font.sans }}
            >
              Onest
            </span>
            <span className={styles.note}>Structure · 400 / 600</span>
          </div>
          <div>
            <span
              className={styles.typeface}
              style={{ fontFamily: theme.font.mono }}
            >
              {familyName(theme.font.mono)}
            </span>
            <span className={styles.note}>Code · 400</span>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default SectionTokens
