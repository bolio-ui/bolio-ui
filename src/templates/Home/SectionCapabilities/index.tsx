import React from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { Section, Container, Text, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'
import CardPlatforms from 'src/components/CardPlatforms'
import styles from './SectionCapabilities.module.css'

const components = [
  {
    title: 'Text',
    image: '/img/png/home/typography.png'
  },
  {
    title: 'Icons',
    image: '/img/png/home/icons.png'
  },
  {
    title: 'Button',
    image: '/img/png/home/button.png'
  }
]

const platforms = [
  {
    title: 'Next.js',
    link: '/docs/guide/bolio-ui-plus-nextjs',
    image: '/img/png/home/nextjs.png'
  },
  {
    title: 'Vite',
    link: '/docs/guide/bolio-ui-plus-vite',
    image: '/img/png/home/vite.png'
  },
  {
    title: 'Remix',
    link: '/docs/guide/bolio-ui-plus-remix',
    image: '/img/png/home/remix.png'
  },
  {
    title: 'Gatsby',
    link: '/docs/guide/bolio-ui-plus-gatsby',
    image: '/img/png/home/gatsby.png'
  },
  {
    title: 'Redwood',
    link: '/docs/guide/bolio-ui-plus-redwoodjs',
    image: '/img/png/home/redwoodjs.png'
  }
]

const guides = [
  'Getting Started',
  'Migrating to v3',
  'Page structure',
  'Contribute'
]

function SectionCapabilities() {
  const theme = useTheme()
  const [active, setActive] = React.useState(0)
  const panelsRef = React.useRef<Array<HTMLDivElement | null>>([])

  const panels = [
    { id: 'docs', label: 'Documentation', color: theme.palette.primary },
    { id: 'components', label: 'Components', color: theme.palette.secondary },
    { id: 'theme', label: 'Theme Generator', color: theme.palette.success },
    { id: 'platforms', label: 'Platforms', color: theme.palette.warning }
  ]

  React.useEffect(() => {
    // The panel crossing the middle of the viewport is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(panelsRef.current.indexOf(entry.target as HTMLDivElement))
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    panelsRef.current.forEach((panel) => panel && observer.observe(panel))
    return () => observer.disconnect()
  }, [])

  const shades = ['Lighter', 'Light', '', 'Dark']
  const colors = ['primary', 'secondary'] as const

  return (
    <Section
      py={5}
      style={
        {
          '--cap-mono': theme.font.mono,
          '--cap-muted': theme.palette.accents_5,
          '--cap-strong': theme.palette.accents_6,
          '--cap-foreground': theme.palette.foreground,
          '--cap-border': theme.palette.border,
          '--cap-radius': theme.layout.radius,
          '--cap-bg': theme.palette.accents_1,
          '--cap-page-bg': theme.palette.background,
          '--cap-hover-border': theme.palette.accents_3
        } as React.CSSProperties
      }
    >
      <Container style={{ maxWidth: 1300 }}>
        <div className={styles.capabilities}>
          <nav className={styles.rail}>
            <Text className={styles.railTitle} font={0.75} my={0} mb={1.5}>
              What you get
            </Text>
            {panels.map((panel, index) => (
              <a
                key={panel.id}
                href={`#capability-${panel.id}`}
                className={`${styles.railItem} ${active === index ? styles.active : ''}`}
              >
                <span
                  className={styles.railBar}
                  style={{ backgroundColor: panel.color }}
                />
                {panel.label}
              </a>
            ))}
          </nav>

          <div className={styles.panels}>
            <div
              id="capability-docs"
              className={styles.panel}
              ref={(el) => {
                panelsRef.current[0] = el
              }}
            >
              <Eyebrow>Documentation</Eyebrow>
              <Text h2 my={0} mb={1}>
                Docs you can copy from.
              </Text>
              <Text font={1.2} mt={0} className={styles.panelDescription}>
                A guide for every framework, a props table for each component
                and examples you paste straight into your project.
              </Text>
              <NextLink
                href="/docs/guide/getting-started"
                className={styles.card}
              >
                <div className={styles.cardBar}>
                  <span className={styles.muted}>docs</span>
                  <span className={styles.muted}>/</span>
                  <span>getting-started</span>
                </div>
                <div className={styles.docsBody}>
                  <div className={styles.docsSidebar}>
                    <span className={styles.docsSidebarTitle}>Guide</span>
                    {guides.map((guide, index) => (
                      <span
                        key={guide}
                        style={{
                          color:
                            index === 0
                              ? theme.palette.primary
                              : theme.palette.accents_5
                        }}
                      >
                        {guide}
                      </span>
                    ))}
                  </div>
                  <div className={styles.docsReading}>
                    <Text h4 my={0}>
                      Getting Started
                    </Text>
                    <Text my={0} className={styles.mutedText}>
                      Install Bolio UI, wrap your app with the provider and
                      start using components right away.
                    </Text>
                    <pre className={styles.code}>
                      <span className={styles.mutedText}>
                        yarn add @bolio-ui/core
                      </span>
                      {'\n'}
                      <span style={{ color: theme.palette.primary }}>
                        {"import { BolioUIProvider } from '@bolio-ui/core'"}
                      </span>
                    </pre>
                  </div>
                </div>
              </NextLink>
            </div>

            <div
              id="capability-components"
              className={styles.panel}
              ref={(el) => {
                panelsRef.current[1] = el
              }}
            >
              <Eyebrow>
                <span style={{ color: theme.palette.secondary }}>
                  Components
                </span>
              </Eyebrow>
              <Text h2 my={0} mb={1}>
                Build even faster with Bolio UI.
              </Text>
              <Text font={1.2} mt={0} className={styles.panelDescription}>
                Premade responsive components designed and built by Bolio UI,
                ready for your next website.
              </Text>
              <NextLink href="/docs/components" className={styles.card}>
                <div className={styles.cardBar}>
                  <span className={styles.muted}>docs</span>
                  <span className={styles.muted}>/</span>
                  <span>components</span>
                </div>
                <div className={styles.componentsGrid}>
                  {components.map((component) => (
                    <div key={component.title} className={styles.componentItem}>
                      <Image
                        src={component.image}
                        alt={`${component.title} component`}
                        width={180}
                        height={121}
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <Text b my={0} mt={0.5}>
                        {component.title}
                      </Text>
                    </div>
                  ))}
                </div>
              </NextLink>
            </div>

            <div
              id="capability-theme"
              className={styles.panel}
              ref={(el) => {
                panelsRef.current[2] = el
              }}
            >
              <Eyebrow>
                <span style={{ color: theme.palette.success }}>
                  Theme Generator
                </span>
              </Eyebrow>
              <Text h2 my={0} mb={1}>
                Your colors, on every component.
              </Text>
              <Text font={1.2} mt={0} className={styles.panelDescription}>
                Pick a primary and a secondary color. Bolio UI derives the
                shades it actually uses and previews them in light and dark.
              </Text>
              <NextLink href="/theme-generator" className={styles.card}>
                <div className={styles.cardBar}>
                  <span>theme-generator</span>
                </div>
                <div className={styles.themeBody}>
                  <div className={styles.themeFields}>
                    {colors.map((name) => (
                      <span key={name} className={styles.themeField}>
                        <span
                          className={styles.dot}
                          style={{ backgroundColor: theme.palette[name] }}
                        />
                        <span className={styles.mutedText}>{name}</span>
                        <span>{theme.palette[name]}</span>
                      </span>
                    ))}
                  </div>
                  {colors.map((name) => (
                    <div key={name} className={styles.themeShades}>
                      {shades.map((shade) => (
                        <span key={shade} className={styles.shade}>
                          <span
                            className={styles.swatch}
                            style={{
                              backgroundColor: theme.palette[`${name}${shade}`]
                            }}
                          />
                          <span className={styles.muted}>
                            {shade || 'Base'}
                          </span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </NextLink>
            </div>

            <div
              id="capability-platforms"
              className={styles.panel}
              ref={(el) => {
                panelsRef.current[3] = el
              }}
            >
              <Eyebrow>
                <span style={{ color: theme.palette.warning }}>Platforms</span>
              </Eyebrow>
              <Text h2 my={0} mb={1}>
                Prepared to get started?
              </Text>
              <Text font={1.2} mt={0} className={styles.panelDescription}>
                Bolio UI is compatible with a wide range platforms. You can
                begin using it right away with Next.js, Gatsby.js, RedwoodJS,
                Vite, or Remix by following the introductory guide.
              </Text>
              <div className={styles.card}>
                <div className={styles.cardBar}>
                  <span className={styles.muted}>docs</span>
                  <span className={styles.muted}>/</span>
                  <span>frameworks</span>
                </div>
                <div className={styles.platformsGrid}>
                  {platforms.map((platform) => (
                    <CardPlatforms key={platform.title} {...platform} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default SectionCapabilities
