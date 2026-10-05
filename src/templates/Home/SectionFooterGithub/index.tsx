import React from 'react'
import NextLink from 'next/link'
import { Section, Container, Text, useTheme } from 'core'
import { ArrowRight } from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'
import styles from './SectionFooterGithub.module.css'

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
    <Section
      py={5}
      style={
        {
          '--footer-border': theme.palette.border,
          '--footer-foreground': theme.palette.foreground,
          '--footer-mono': theme.font.mono,
          '--footer-muted': theme.palette.accents_5
        } as React.CSSProperties
      }
    >
      <Container style={{ maxWidth: 1300 }}>
        <div className={styles.head}>
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
          <NextLink href="/docs/guide/getting-started" className={styles.cta}>
            Get started
            <ArrowRight fontSize={18} />
          </NextLink>
        </div>
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statLabel}>{stat.label}</span>
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
    </Section>
  )
}

export default SectionFooterGithub
