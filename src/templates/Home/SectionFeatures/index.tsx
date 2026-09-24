import React from 'react'
import { Section, Container, Text, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'

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
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <Eyebrow>
          <span style={{ color: theme.palette.accents_5 }}>
            One theme, every component
          </span>
        </Eyebrow>
        <Text h2 my={0} mb={2}>
          Set it once. Every component follows.
        </Text>
        <div className="features">
          <div className="entry">
            <span className="entry-title">Theme</span>
            {themeEntries.map((entry) => (
              <div key={entry.label} className="entry-row">
                <span className="muted">{entry.label}</span>
                <span
                  style={{ color: entry.color || theme.palette.foreground }}
                >
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
          <div className="rows">
            {features.map((feature) => (
              <div key={feature.label} className="row">
                <span
                  className="row-label"
                  style={{ color: theme.palette.warning }}
                >
                  {feature.label}
                </span>
                <span
                  className="row-tag"
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
      <style jsx>{`
        .features {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 48px;
          align-items: start;
        }
        .entry {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 24px;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.accents_1};
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
        }
        .entry-title {
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${theme.palette.accents_6};
        }
        .entry-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }
        .muted {
          color: ${theme.palette.accents_5};
        }
        .rows {
          border-top: 1px solid ${theme.palette.border};
        }
        .row {
          display: grid;
          grid-template-columns: 160px 180px minmax(0, 1fr);
          gap: 16px;
          align-items: baseline;
          padding: 14px 0;
          border-bottom: 1px solid ${theme.palette.border};
        }
        .row-label,
        .row-tag {
          font-family: ${theme.font.mono};
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .row-tag {
          text-transform: none;
          letter-spacing: 0;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .features {
            grid-template-columns: minmax(0, 1fr);
            gap: 32px;
          }
          .row {
            grid-template-columns: minmax(0, 1fr);
            gap: 4px;
          }
        }
      `}</style>
    </Section>
  )
}

export default SectionFeatures
