import React from 'react'
import NextLink from 'next/link'
import { Section, Container, Text, useTheme } from 'core'
import { ArrowRight } from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'

const stats = [
  { label: 'components', value: '51' },
  { label: 'hooks', value: '13' },
  { label: 'guides', value: '13' },
  { label: 'frameworks', value: '5' },
  { label: 'license', value: 'MIT' }
]

function SectionFooterGithub() {
  const theme = useTheme()

  return (
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <div className="head">
          <div>
            <Eyebrow>
              <span style={{ color: theme.palette.warning }}>
                Components, hooks, themes, guides.
              </span>
            </Eyebrow>
            <Text h1 my={0}>
              Start coding in seconds with Bolio UI
            </Text>
          </div>
          <NextLink href="/docs/guide/getting-started" className="cta">
            Get started
            <ArrowRight fontSize={18} />
          </NextLink>
        </div>
        <div className="stats">
          {stats.map((stat, index) => (
            <div key={stat.label} className="stat">
              <span className="stat-label">{stat.label}</span>
              <span
                style={{
                  color:
                    index === stats.length - 1
                      ? theme.palette.success
                      : theme.palette.foreground
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </Container>
      <style jsx>{`
        .head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          margin-bottom: 96px;
        }
        .head :global(.cta) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          width: 340px;
          padding-bottom: 12px;
          border-bottom: 1px solid ${theme.palette.border};
          color: ${theme.palette.foreground};
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          transition: border-color 200ms ease;
        }
        .head :global(.cta:hover) {
          border-color: ${theme.palette.foreground};
        }
        .stats {
          border-top: 1px solid ${theme.palette.border};
        }
        .stat {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid ${theme.palette.border};
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
        }
        .stat-label {
          color: ${theme.palette.accents_5};
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .head {
            flex-direction: column;
            margin-bottom: 48px;
          }
          .head :global(.cta) {
            width: 100%;
          }
        }
      `}</style>
    </Section>
  )
}

export default SectionFooterGithub
