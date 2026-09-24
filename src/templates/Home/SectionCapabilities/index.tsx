import React from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { Section, Container, Text, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'
import CardPlatforms from 'src/components/CardPlatforms'

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
  'Migrating to v2',
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
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <div className="capabilities">
          <nav className="rail">
            <Text className="rail-title" font={0.75} my={0} mb={1.5}>
              What you get
            </Text>
            {panels.map((panel, index) => (
              <a
                key={panel.id}
                href={`#capability-${panel.id}`}
                className={`rail-item ${active === index ? 'active' : ''}`}
              >
                <span
                  className="rail-bar"
                  style={{ backgroundColor: panel.color }}
                />
                {panel.label}
              </a>
            ))}
          </nav>

          <div className="panels">
            <div
              id="capability-docs"
              className="panel"
              ref={(el) => {
                panelsRef.current[0] = el
              }}
            >
              <Eyebrow>Documentation</Eyebrow>
              <Text h2 my={0} mb={1}>
                Docs you can copy from.
              </Text>
              <Text font={1.2} mt={0} className="panel-description">
                A guide for every framework, a props table for each component
                and examples you paste straight into your project.
              </Text>
              <NextLink href="/docs/guide/getting-started" className="card">
                <div className="card-bar">
                  <span className="muted">docs</span>
                  <span className="muted">/</span>
                  <span>getting-started</span>
                </div>
                <div className="docs-body">
                  <div className="docs-sidebar">
                    <span className="docs-sidebar-title">Guide</span>
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
                  <div className="docs-reading">
                    <Text h4 my={0}>
                      Getting Started
                    </Text>
                    <Text my={0} className="muted-text">
                      Install Bolio UI, wrap your app with the provider and
                      start using components right away.
                    </Text>
                    <pre className="code">
                      <span className="muted-text">
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
              className="panel"
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
              <Text font={1.2} mt={0} className="panel-description">
                Premade responsive components designed and built by Bolio UI,
                ready for your next website.
              </Text>
              <NextLink href="/docs/components" className="card">
                <div className="card-bar">
                  <span className="muted">docs</span>
                  <span className="muted">/</span>
                  <span>components</span>
                </div>
                <div className="components-grid">
                  {components.map((component) => (
                    <div key={component.title} className="component-item">
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
              className="panel"
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
              <Text font={1.2} mt={0} className="panel-description">
                Pick a primary and a secondary color. Bolio UI derives the
                shades it actually uses and previews them in light and dark.
              </Text>
              <NextLink href="/theme-generator" className="card">
                <div className="card-bar">
                  <span>theme-generator</span>
                </div>
                <div className="theme-body">
                  <div className="theme-fields">
                    {colors.map((name) => (
                      <span key={name} className="theme-field">
                        <span
                          className="dot"
                          style={{ backgroundColor: theme.palette[name] }}
                        />
                        <span className="muted-text">{name}</span>
                        <span>{theme.palette[name]}</span>
                      </span>
                    ))}
                  </div>
                  {colors.map((name) => (
                    <div key={name} className="theme-shades">
                      {shades.map((shade) => (
                        <span key={shade} className="shade">
                          <span
                            className="swatch"
                            style={{
                              backgroundColor: theme.palette[`${name}${shade}`]
                            }}
                          />
                          <span className="muted">{shade || 'Base'}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </NextLink>
            </div>

            <div
              id="capability-platforms"
              className="panel"
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
              <Text font={1.2} mt={0} className="panel-description">
                Bolio UI is compatible with a wide range platforms. You can
                begin using it right away with Next.js, Gatsby.js, RedwoodJS,
                Vite, or Remix by following the introductory guide.
              </Text>
              <div className="card">
                <div className="card-bar">
                  <span className="muted">docs</span>
                  <span className="muted">/</span>
                  <span>frameworks</span>
                </div>
                <div className="platforms-grid">
                  {platforms.map((platform) => (
                    <CardPlatforms key={platform.title} {...platform} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <style jsx>{`
        .capabilities {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          gap: 48px;
        }
        .rail {
          position: sticky;
          top: 120px;
          align-self: start;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .rail :global(.rail-title) {
          font-family: ${theme.font.mono};
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${theme.palette.accents_5};
        }
        .rail-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          gap: 10px;
          font-size: 1.25rem;
          color: ${theme.palette.foreground};
          opacity: 0.38;
          transition: opacity 260ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 260ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .rail-item.active {
          opacity: 1;
          transform: translateX(6px);
        }
        .rail-bar {
          width: 46px;
          height: 2px;
          transform-origin: left center;
          transform: scaleX(0.25);
          opacity: 0.35;
          transition: transform 260ms cubic-bezier(0.23, 1, 0.32, 1),
            opacity 260ms linear;
        }
        .rail-item.active .rail-bar {
          transform: scaleX(1);
          opacity: 1;
        }
        .panels {
          display: flex;
          flex-direction: column;
          gap: 160px;
        }
        .panel {
          scroll-margin-top: 120px;
        }
        .panel :global(.panel-description) {
          max-width: 600px;
          color: ${theme.palette.accents_6};
        }
        .panel :global(.card) {
          display: block;
          margin-top: 32px;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.accents_1};
          color: ${theme.palette.foreground};
          overflow: hidden;
          transition: border-color 200ms ease;
        }
        .panel :global(.card:hover) {
          border-color: ${theme.palette.accents_4};
        }
        .card-bar {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid ${theme.palette.border};
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
        }
        .muted {
          color: ${theme.palette.accents_5};
        }
        .panel :global(.muted-text) {
          color: ${theme.palette.accents_6};
        }
        .docs-body {
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr);
          gap: 24px;
          padding: 24px;
        }
        .docs-sidebar {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.85rem;
        }
        .docs-sidebar-title {
          font-family: ${theme.font.mono};
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${theme.palette.accents_5};
        }
        .docs-reading {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .code {
          margin: 0;
          padding: 16px;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.background};
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
          white-space: pre-wrap;
        }
        .components-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          padding: 24px;
        }
        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px;
          padding: 24px;
        }
        .component-item :global(img) {
          border-radius: ${theme.layout.radius};
        }
        .theme-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px;
        }
        .theme-fields {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .theme-field {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .theme-shades {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }
        .shade {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: ${theme.font.mono};
          font-size: 0.7rem;
        }
        .swatch {
          height: 36px;
          border-radius: ${theme.layout.radius};
        }
        .theme-previews {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .theme-preview {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          border: 1px solid;
          border-radius: ${theme.layout.radius};
          font-family: ${theme.font.mono};
          font-size: 0.7rem;
        }
        .preview-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-button {
          padding: 4px 12px;
          border: 1px solid transparent;
          border-radius: 999px;
          font-family: ${theme.font.sans};
          font-size: 0.75rem;
          color: #fff;
        }
        .preview-toggle {
          position: relative;
          width: 26px;
          height: 14px;
          margin-left: auto;
          border-radius: 999px;
        }
        .preview-toggle::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #fff;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .capabilities {
            grid-template-columns: minmax(0, 1fr);
          }
          .rail {
            display: none;
          }
          .panels {
            gap: 80px;
          }
          .docs-body {
            grid-template-columns: minmax(0, 1fr);
          }
          .docs-sidebar {
            display: none;
          }
          .platforms-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </Section>
  )
}

export default SectionCapabilities
