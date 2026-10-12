'use client'

import React from 'react'
import {
  Section,
  Container,
  Spacer,
  Text,
  Collapse,
  Link,
  Input,
  useTheme
} from 'core'
import { Search } from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'
import Base from 'src/templates/Base'

type Question = { title: string; answer: React.ReactNode }

const faq: Array<{ section: string; questions: Array<Question> }> = [
  {
    section: 'Getting started',
    questions: [
      {
        title: 'How do I add Bolio UI to a project?',
        answer: (
          <>
            Run <code>npx @bolio-ui/cli@latest init</code> at the root of your
            project. It detects the framework, installs{' '}
            <code>@bolio-ui/core</code> and edits the root file. To do it by
            hand, follow{' '}
            <Link href="/docs/guide/getting-started">Getting Started</Link>.
          </>
        )
      },
      {
        title: 'Which React versions are supported?',
        answer:
          'React 18.2 or later, including React 19. Bolio UI is tested on both.'
      },
      {
        title: 'Which frameworks work with Bolio UI?',
        answer:
          'Next.js, Vite, React Router, Remix, Gatsby, RedwoodJS, TanStack Start, Waku, RedwoodSDK and Astro have a guide and a CLI template. Any other React setup works with the manual steps.'
      },
      {
        title: 'Do I need BolioUIProvider and CssBaseline?',
        answer: (
          <>
            Yes. <code>BolioUIProvider</code> gives every component its theme
            and <code>CssBaseline</code> sets the base styles of the page. Place
            both once at the root of your app.
          </>
        )
      }
    ]
  },
  {
    section: 'Styles',
    questions: [
      {
        title: 'Why do my components render without styles?',
        answer: (
          <>
            The stylesheet is missing. Import{' '}
            <code>@bolio-ui/core/styles.css</code> once, anywhere before the
            components render, such as <code>app/layout</code> or{' '}
            <code>src/main.tsx</code>.
          </>
        )
      },
      {
        title: 'How do I override the style of a component?',
        answer:
          'Write a plain CSS rule in your own stylesheet. Component styles live in a CSS @layer below unlayered CSS, so your rule wins without !important or extra specificity. Prefer the documented props and CSS custom properties over internal class names.'
      },
      {
        title: 'Can I import only the CSS of the components I use?',
        answer: (
          <>
            Yes. Import <code>@bolio-ui/core/css/*</code> for one stylesheet per
            component, in place of the combined file.
          </>
        )
      },
      {
        title: 'Do I need styled-jsx or a styles registry?',
        answer:
          'No. Since v3 the styles ship as static CSS, so there is no runtime injection and no registry for the App Router.'
      }
    ]
  },
  {
    section: 'Themes',
    questions: [
      {
        title: 'How do I switch between light and dark?',
        answer: (
          <>
            Change the <code>themeType</code> prop of{' '}
            <code>BolioUIProvider</code> and every component adapts. See{' '}
            <Link href="/docs/guide/customize-themes">Customize Themes</Link>.
          </>
        )
      },
      {
        title: 'How do I change the primary color?',
        answer: (
          <>
            Create a theme with <code>Themes.createFromLight</code>. Not sure
            which colors to pick? The{' '}
            <Link href="/theme-generator">Theme Generator</Link> previews them
            on real components and gives you the code.
          </>
        )
      },
      {
        title: 'Can I use a custom font?',
        answer: (
          <>
            Yes. Load the font in your app and set it in your theme or in your
            own CSS. The Fonts section of{' '}
            <Link href="/docs/guide/customize-themes">Customize Themes</Link>{' '}
            shows an example.
          </>
        )
      }
    ]
  },
  {
    section: 'Components',
    questions: [
      {
        title: 'How do I get a ref to a component?',
        answer: (
          <>
            Most components forward their ref to the main element. See{' '}
            <Link href="/docs/guide/refs-and-accessibility">
              Refs and accessibility
            </Link>{' '}
            for the details.
          </>
        )
      },
      {
        title: 'Are the components accessible?',
        answer:
          'Yes. Components follow the WAI-ARIA patterns, work with the keyboard and expose roles and states. Controls without visible text need an aria-label, which the guide explains.'
      },
      {
        title: 'How do I build the layout of a page?',
        answer: (
          <>
            Nest <code>Section</code>, <code>Container</code>, <code>Row</code>{' '}
            and <code>Col</code>. The{' '}
            <Link href="/docs/guide/page-structure">Page structure</Link> guide
            has a live example.
          </>
        )
      },
      {
        title: 'Where are the icons?',
        answer: (
          <>
            In the separate <code>@bolio-ui/icons</code> package. Browse them at{' '}
            <Link href="https://icons.bolio-ui.com/" target="_blank">
              icons.bolio-ui.com
            </Link>
            .
          </>
        )
      }
    ]
  },
  {
    section: 'Migrating',
    questions: [
      {
        title: 'What changed in v3?',
        answer: (
          <>
            The styled-jsx runtime is gone and styles ship as one CSS file. Read{' '}
            <Link href="/docs/guide/migration-v2-to-v3">Migrating to v3</Link>{' '}
            for the breaking changes and a checklist.
          </>
        )
      },
      {
        title: 'Where is the documentation of v2?',
        answer: (
          <>
            At{' '}
            <Link href="https://v2.bolio-ui.com" target="_blank">
              v2.bolio-ui.com
            </Link>
            .
          </>
        )
      },
      {
        title: 'How do I report a bug or suggest a feature?',
        answer: (
          <>
            Open an issue on{' '}
            <Link
              href="https://github.com/bolio-ui/bolio-ui/issues/new/choose"
              target="_blank"
            >
              GitHub
            </Link>
            . To send a fix yourself, read{' '}
            <Link href="/docs/guide/contribute">Contribute</Link>.
          </>
        )
      }
    ]
  }
]

const total = faq.reduce((sum, { questions }) => sum + questions.length, 0)

export default function FaqTemplate() {
  const theme = useTheme()
  const [query, setQuery] = React.useState('')
  const term = query.trim().toLowerCase()
  const results = faq
    .map(({ section, questions }) => ({
      section,
      questions: questions.filter(({ title }) =>
        title.toLowerCase().includes(term)
      )
    }))
    .filter(({ questions }) => questions.length > 0)

  const count = results.reduce(
    (sum, { questions }) => sum + questions.length,
    0
  )

  return (
    <Base>
      <Section
        py={5}
        style={{
          textAlign: 'center',
          borderBottom: `1px solid ${theme.palette.border}`,
          background: `radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in srgb, ${theme.palette.primary} 14%, transparent), transparent), ${theme.palette.accents_1}`
        }}
      >
        <Container style={{ maxWidth: 680 }}>
          <Eyebrow>FAQ</Eyebrow>
          <Text b font={3} style={{ lineHeight: 1.2 }}>
            How can we help?
          </Text>
          <Text p font={1.1} style={{ color: theme.palette.accents_6 }} mt={1}>
            Quick answers about installing, styling and theming Bolio UI.
          </Text>
          <Spacer h={1.5} />
          <Input
            width="100%"
            scale={1.4}
            rounded
            icon={<Search />}
            clearable
            placeholder="Search the questions"
            aria-label="Search the questions"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Text
            small
            role="status"
            style={{ color: theme.palette.accents_5, display: 'block' }}
            mt={1}
          >
            {term
              ? `${count} ${count === 1 ? 'question' : 'questions'} found`
              : `${total} questions in ${faq.length} topics`}
          </Text>
        </Container>
      </Section>
      <Section py={3}>
        <Container style={{ maxWidth: 800 }}>
          {results.length === 0 && (
            <Text p style={{ textAlign: 'center' }}>
              No question matches &quot;{query.trim()}&quot;. Clear the search
              or try another word.
            </Text>
          )}
          {results.map(({ section, questions }, index) => (
            <React.Fragment key={section}>
              {index > 0 && <Spacer h={2} />}
              <Text h3>{section}</Text>
              <Collapse.Group accordion={false}>
                {questions.map(({ title, answer }) => (
                  <Collapse key={title} title={title}>
                    <Text p>{answer}</Text>
                  </Collapse>
                ))}
              </Collapse.Group>
            </React.Fragment>
          ))}
        </Container>
      </Section>
    </Base>
  )
}
