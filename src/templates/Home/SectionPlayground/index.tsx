import React from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import {
  BolioUIProvider,
  Button,
  Card,
  Section,
  Container,
  Text,
  Themes,
  useTheme
} from 'core'
import * as Icons from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'
import WindowFrame from 'src/components/WindowFrame'

type Icon = keyof typeof Icons

type Config = {
  palette?: Record<string, string>
  layout?: { radius: string }
  font?: { sans: string }
}

type Preset = {
  id: string
  name: string
  icon: Icon
  config: (isLight: boolean) => Config
  content: {
    title: string
    description: string
    // Bold value, faded value (struck through when `strike`) and accent value.
    meta: [string, string, string]
    strike?: boolean
    image: string
    options: Array<string>
    actions: [string, string]
  }
}

// Each preset changes more than colors: typeface, radius and the story told
// by the card, so the demo shows how far a Bolio UI theme can go.
const presets: Array<Preset> = [
  {
    id: 'bolio',
    name: 'Bolio UI',
    icon: 'Box',
    config: () => ({}),
    content: {
      title: 'Neon Windbreaker',
      description: 'Light, waterproof and made for late nights.',
      meta: ['$129.00', '$180', '28% off'],
      strike: true,
      image: '/img/jpg/home/img2.jpg',
      options: ['XS', 'S', 'M', 'L', 'XL'],
      actions: ['Buy now', 'Add to bag']
    }
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    config: (isLight) => ({
      palette: {
        primary: '#15803D',
        secondary: '#0891B2',
        background: isLight ? '#F6F8F6' : '#0B1110'
      },
      layout: { radius: '4px' },
      font: { sans: 'Menlo, Consolas, monospace' }
    }),
    content: {
      title: 'deploy --preview',
      description: 'Every branch gets its own URL before it reaches main.',
      meta: ['142 builds', 'this week', 'all green'],
      image: '/img/jpg/home/img4.jpg',
      options: ['main', 'staging', 'dev'],
      actions: ['Deploy', 'View logs']
    }
  },
  {
    id: 'editorial',
    name: 'Editorial',
    icon: 'BookOpen',
    config: (isLight) => ({
      palette: {
        primary: '#9F1239',
        secondary: isLight ? '#111111' : '#FAFAFA'
      },
      layout: { radius: '0px' },
      font: { sans: 'Georgia, "Times New Roman", serif' }
    }),
    content: {
      title: 'The Color Issue',
      description: 'Twelve photographers on the shade that shaped their work.',
      meta: ['Issue 07', 'Spring', '18 min read'],
      image: '/img/jpg/home/img3.jpg',
      options: ['Print', 'Digital', 'Both'],
      actions: ['Subscribe', 'Read a sample']
    }
  },
  {
    id: 'groove',
    name: 'Groove',
    icon: 'Headphones',
    config: () => ({
      palette: { primary: '#DB2777', secondary: '#F59E0B' },
      layout: { radius: '24px' },
      font: { sans: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif' }
    }),
    content: {
      title: 'Midnight Frequencies',
      description: 'A playlist for coding after dark, updated every Friday.',
      meta: ['32 tracks', '2h 14m', 'new'],
      image: '/img/jpg/home/img1.jpg',
      options: ['Chill', 'Focus', 'Hype'],
      actions: ['Play', 'Follow']
    }
  }
]

function SectionPlayground() {
  const theme = useTheme()
  const [preset, setPreset] = React.useState(presets[0])
  const [option, setOption] = React.useState(preset.content.options[0])
  const codeRef = React.useRef<HTMLPreElement>(null)
  const blocksRef = React.useRef<Record<string, HTMLDivElement | null>>({})

  // The demo follows the site's light/dark mode.
  const isLight = theme.type === 'light'
  const factory = isLight ? 'createFromLight' : 'createFromDark'

  const previewTheme = React.useMemo(
    () =>
      Themes[factory]({
        type: `playground-${preset.id}`,
        ...preset.config(isLight)
      }),
    [factory, isLight, preset]
  )

  React.useEffect(() => {
    const block = blocksRef.current[preset.id]
    codeRef.current?.scrollTo({
      top: (block?.offsetTop || 0) - 16,
      behavior: 'smooth'
    })
  }, [preset])

  const selectPreset = (item: Preset) => {
    setPreset(item)
    setOption(item.content.options[0])
  }

  const muted = (text: string) => <span className="muted">{text}</span>
  const string = (text: string) => (
    <span style={{ color: theme.palette.success }}>{`'${text}'`}</span>
  )

  const { content } = preset

  return (
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <div className="head">
          <div>
            <Eyebrow>Theming</Eyebrow>
            <Text h2 my={0} mb={1}>
              Apply your own theming decisions.
            </Text>
            <Text
              font={1.2}
              mt={0}
              style={{ maxWidth: 600, color: theme.palette.accents_6 }}
            >
              Colors, typeface and radius all live in one theme object. Start
              from the default light and dark themes or create your own.
            </Text>
          </div>
          <NextLink href="/docs/guide/customize-themes" className="learn">
            Customize themes →
          </NextLink>
        </div>

        <div className="playground">
          <div className="demo">
            <div className="presets" role="tablist">
              {presets.map((item) => {
                const PresetIcon = Icons[item.icon]
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={item === preset}
                    className={`preset ${item === preset ? 'active' : ''}`}
                    onClick={() => selectPreset(item)}
                  >
                    <PresetIcon fontSize={36} />
                    {item.name}
                  </button>
                )
              })}
            </div>

            <BolioUIProvider
              themes={[previewTheme]}
              themeType={previewTheme.type}
            >
              <div
                className="preview"
                style={{ fontFamily: previewTheme.font.sans }}
              >
                <Card
                  width="100%"
                  style={{
                    backgroundColor: previewTheme.palette.background,
                    borderRadius: previewTheme.layout.radius
                  }}
                >
                  <div className="product">
                    <Image
                      key={content.image}
                      src={content.image}
                      alt={content.title}
                      width={240}
                      height={320}
                      className="product-image"
                      style={{ borderRadius: previewTheme.layout.radius }}
                    />
                    <div>
                      <div className="product-title">
                        <Text h4 my={0}>
                          {content.title}
                        </Text>
                        <Icons.Star
                          fontSize={18}
                          color={previewTheme.palette.secondary}
                        />
                      </div>
                      <Text
                        my={0.5}
                        style={{ color: previewTheme.palette.accents_6 }}
                      >
                        {content.description}
                      </Text>
                      <Text b font={1.1} my={0.5}>
                        {content.meta[0]}{' '}
                        <Text
                          span
                          del={content.strike}
                          style={{ color: previewTheme.palette.accents_5 }}
                        >
                          {content.meta[1]}
                        </Text>{' '}
                        <Text span type="secondary">
                          {content.meta[2]}
                        </Text>
                      </Text>
                      <div className="options">
                        {content.options.map((item) => (
                          <Button
                            key={item}
                            auto
                            scale={0.5}
                            type={item === option ? 'primary' : 'abort'}
                            onClick={() => setOption(item)}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                      <div className="actions">
                        <Button auto scale={0.75} type="primary">
                          {content.actions[0]}
                        </Button>
                        <Button auto scale={0.75} type="primary" ghost>
                          {content.actions[1]}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </BolioUIProvider>
          </div>

          <WindowFrame>
            <pre className="code" ref={codeRef}>
              {muted("import { Themes } from '@bolio-ui/core'")}
              {presets.map((item) => {
                const config = item.config(isLight)
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      blocksRef.current[item.id] = el
                    }}
                    className={`block ${item === preset ? 'active' : ''}`}
                  >
                    {muted('const')} {item.id} {muted('= Themes.')}
                    <span style={{ color: theme.palette.primary }}>
                      {factory}
                    </span>
                    {'({\n  type: '}
                    {string(item.id)}
                    {Object.entries(config).map(([group, values]) => (
                      <React.Fragment key={group}>
                        {`,\n  ${group}: {`}
                        {Object.entries(values).map(([name, value], index) => (
                          <React.Fragment key={name}>
                            {index > 0 && ','}
                            {`\n    ${name}: `}
                            {string(value)}
                          </React.Fragment>
                        ))}
                        {'\n  }'}
                      </React.Fragment>
                    ))}
                    {'\n})'}
                  </div>
                )
              })}
            </pre>
          </WindowFrame>
        </div>
      </Container>
      <style jsx>{`
        .playground {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 32px;
          align-items: start;
          margin-top: 40px;
        }
        .demo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          min-width: 0;
        }
        .presets {
          display: flex;
          gap: 32px;
        }
        .preset {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 0;
          border: 0;
          background: none;
          font: inherit;
          font-size: 0.9rem;
          color: ${theme.palette.accents_5};
          cursor: pointer;
          transition: color 200ms ease;
        }
        .preset:hover,
        .preset.active {
          color: ${theme.palette.foreground};
        }
        .preview {
          width: 100%;
        }
        .preview :global(p),
        .preview :global(small) {
          font-family: inherit;
        }
        .product {
          display: grid;
          grid-template-columns: 160px minmax(0, 1fr);
          gap: 20px;
        }
        .product :global(.product-image) {
          width: 100%;
          height: 100%;
          max-height: 220px;
          object-fit: cover;
        }
        .product-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .options,
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .actions {
          margin-top: 20px;
        }
        .head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }
        .head :global(.learn) {
          flex-shrink: 0;
          margin-bottom: 1rem;
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
          color: ${theme.palette.primary};
        }
        .code {
          position: relative;
          height: 360px;
          margin: 0;
          padding: 0;
          border: 0;
          overflow: hidden;
          background: none;
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
          line-height: 1.7;
          white-space: pre-wrap;
          color: ${theme.palette.foreground};
        }
        .block {
          margin-top: 24px;
          opacity: 0.35;
          transition: opacity 200ms ease;
        }
        .block.active {
          opacity: 1;
        }
        .code :global(.muted) {
          color: ${theme.palette.accents_5};
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .head {
            flex-direction: column;
            align-items: flex-start;
          }
          .playground {
            grid-template-columns: minmax(0, 1fr);
          }
          .presets {
            gap: 20px;
          }
          .product {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </Section>
  )
}

export default SectionPlayground
