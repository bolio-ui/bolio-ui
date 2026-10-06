import React from 'react'
import { Section, Text, Container, Grid, Row, Link, useTheme } from 'core'
import { Github, Instagram, Twitter } from '@bolio-ui/icons'
import Logo from 'src/components/Logo'
import FooterMeta from './FooterMeta'
import styles from './Footer.module.css'

const socials = [
  {
    label: 'Github',
    href: 'https://github.com/bolio-ui/bolio-ui',
    Icon: Github
  },
  {
    label: 'Twitter',
    href: 'https://www.twitter.com/bolio_ui/',
    Icon: Twitter
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bolio.ui/',
    Icon: Instagram
  }
]

function Footer() {
  const theme = useTheme()

  return (
    <Section
      py={2}
      style={
        {
          borderTop: `1px solid ${theme.palette.border}`,
          '--footer-muted': theme.palette.accents_5,
          '--footer-foreground': theme.palette.foreground
        } as React.CSSProperties
      }
    >
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container gap={2} alignItems="center">
          <Grid xs={12} md={6}>
            <Logo name="Bolio UI" />
            <div className={styles.tagline}>
              <Text
                font={0.85}
                my={0}
                style={{ color: theme.palette.accents_5 }}
              >
                Amazing, modern and creative tools for React UI.
              </Text>
              <div className={styles.social}>
                {socials.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Link to ${label} Bolio UI`}
                  >
                    <Icon fontSize={15} />
                  </Link>
                ))}
              </div>
            </div>
          </Grid>
          <Grid xs={12} md={6}>
            <div className={styles.links}>
              <Row justify="end" style={{ flexWrap: 'wrap', gap: 24 }}>
                <Link href="/docs/guide/getting-started">Guide</Link>
                <Link href="/docs/components/avatar">Components</Link>
                <Link href="/docs/hooks/use-body-scroll">Hooks</Link>
                <Link href="/theme-generator">Theme Generator</Link>
              </Row>
            </div>
          </Grid>
        </Grid.Container>
        <div
          style={{
            marginTop: theme.layout.gap,
            borderTop: `1px solid ${theme.palette.border}`,
            paddingTop: theme.layout.gap
          }}
        >
          <FooterMeta />
        </div>
      </Container>
    </Section>
  )
}

export default Footer
