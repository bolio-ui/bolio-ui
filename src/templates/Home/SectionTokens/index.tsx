import React from 'react'
import { Section, Container, Text, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'

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
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <Eyebrow>
          <span style={{ color: theme.palette.accents_5 }}>Make it yours</span>
        </Eyebrow>
        <Text h2 my={0} mb={2}>
          Sixteen colors and two typefaces.
        </Text>
        <div className="swatches">
          {tokens.map((token) => (
            <span
              key={token}
              className="swatch"
              title={`palette.${token}`}
              style={{ backgroundColor: theme.palette[token] }}
            />
          ))}
        </div>
        <p className="note">
          Every component uses one of these. Change a token in your theme, the
          whole app follows.
        </p>
        <div className="typefaces">
          <div>
            <span className="typeface" style={{ fontFamily: theme.font.sans }}>
              {familyName(theme.font.sans)}
            </span>
            <span className="note">Structure · 400 / 600</span>
          </div>
          <div>
            <span className="typeface" style={{ fontFamily: theme.font.mono }}>
              {familyName(theme.font.mono)}
            </span>
            <span className="note">Code · 400</span>
          </div>
        </div>
      </Container>
      <style jsx>{`
        .swatches {
          display: grid;
          grid-template-columns: repeat(${tokens.length}, minmax(0, 1fr));
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          overflow: hidden;
        }
        .swatch {
          height: 48px;
          border-right: 1px solid ${theme.palette.border};
        }
        .swatch:last-child {
          border-right: 0;
        }
        .note {
          display: block;
          max-width: 400px;
          margin: 24px 0 0;
          font-family: ${theme.font.mono};
          font-size: 0.75rem;
          color: ${theme.palette.accents_5};
        }
        .typefaces {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid ${theme.palette.border};
        }
        .typefaces .note {
          margin-top: 4px;
        }
        .typeface {
          display: block;
          font-size: 1.75rem;
          color: ${theme.palette.foreground};
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .swatches {
            grid-template-columns: repeat(${tokens.length / 2}, minmax(0, 1fr));
          }
          .typefaces {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </Section>
  )
}

export default SectionTokens
