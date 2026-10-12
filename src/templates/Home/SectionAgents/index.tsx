import React from 'react'
import NextLink from 'next/link'
import {
  Section,
  Container,
  Text,
  SegmentedControl,
  Snippet,
  useTheme
} from 'core'
import { ArrowRight, FileText, Zap, Server, Terminal } from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'
import styles from './SectionAgents.module.css'

const features = [
  {
    icon: FileText,
    title: 'LLMs.txt',
    text: 'llms.txt and llms-full.txt follow the LLMs.txt standard. Give the URL to Cursor, Windsurf, ChatGPT or Claude.'
  },
  {
    icon: Zap,
    title: 'Agent Skills',
    text: 'Install the Bolio UI Skill and the assistant learns the setup and the rules of the library.'
  },
  {
    icon: Server,
    title: 'MCP server',
    text: '@bolio-ui/mcp gives assistants direct access to component docs, hooks and theme tokens.'
  },
  {
    icon: Terminal,
    title: 'AGENTS.md',
    text: 'One command adds the docs links to the AGENTS.md of your project.'
  }
]

const tabs = [
  {
    value: 'docs',
    label: 'Documentation',
    code: 'Use the Bolio UI documentation from https://bolio-ui.com/llms.txt',
    symbol: '',
    href: '/docs/guide/llms-txt',
    steps: [
      'The assistant opens llms.txt and finds the page of each component.',
      'It reads the props and the examples before it writes code.',
      'Give it llms-full.txt when the whole documentation fits its context.'
    ]
  },
  {
    value: 'skills',
    label: 'Skills',
    code: 'npx skills add bolio-ui/bolio-ui',
    symbol: '$',
    href: '/docs/guide/agent-skills',
    steps: [
      'The Skill is installed in .agents/skills/bolio-ui.',
      'Claude Code gets a link to it.',
      'The assistant loads it when you work with @bolio-ui/core.'
    ]
  },
  {
    value: 'mcp',
    label: 'MCP server',
    code: 'claude mcp add bolio-ui -- npx -y @bolio-ui/mcp@latest',
    symbol: '$',
    href: '/docs/guide/mcp-server',
    steps: [
      'list_components and list_hooks show what exists.',
      'get_component_docs returns the props and the examples.',
      'get_theme_variables returns the tokens of the light and dark themes.',
      'get_docs reads any page of the guide.'
    ]
  },
  {
    value: 'agents',
    label: 'AGENTS.md',
    code: 'npx @bolio-ui/cli@latest agents-md',
    symbol: '$',
    href: '/docs/guide/agents-md',
    steps: [
      'Adds a Bolio UI section with the links of llms.txt.',
      'Keeps the rest of your AGENTS.md as it is.',
      'Run it again and the section is updated, not repeated.'
    ]
  }
]

function SectionAgents() {
  const theme = useTheme()
  const [tab, setTab] = React.useState<string | number>(tabs[0].value)
  const current = tabs.find((item) => item.value === tab) ?? tabs[0]

  return (
    <Section
      py={5}
      style={
        {
          '--agents-border': theme.palette.border,
          '--agents-radius': theme.layout.radius,
          '--agents-bg': theme.palette.accents_1,
          '--agents-strong': theme.palette.accents_6,
          '--agents-muted': theme.palette.accents_5,
          '--agents-link': theme.palette.primary
        } as React.CSSProperties
      }
    >
      <Container style={{ maxWidth: 1400 }}>
        <div className={styles.agents}>
          <div>
            <Eyebrow>UI for Agents</Eyebrow>
            <Text h2 my={0} mb={1}>
              Built for the AI-assisted workflow
            </Text>
            <Text font={1.2} mt={0} className={styles.description}>
              The docs, a Skill and an MCP server give Claude Code, Cursor,
              Windsurf and any assistant the real props and examples of Bolio
              UI, so the code it writes matches the library.
            </Text>
            <NextLink href="/docs/guide/llms-txt" className={styles.learnMore}>
              Learn more about UI for Agents
              <ArrowRight fontSize={16} />
            </NextLink>
            <div className={styles.features}>
              {features.map(({ icon: Icon, title, text }) => (
                <section key={title} className={styles.feature}>
                  <span className={styles.featureIcon}>
                    <Icon fontSize={22} />
                  </span>
                  <div>
                    <Text b my={0}>
                      {title}
                    </Text>
                    <Text my={0} className={styles.featureText}>
                      {text}
                    </Text>
                  </div>
                </section>
              ))}
            </div>
          </div>
          <div className={styles.install}>
            <div className={styles.installBar}>
              <SegmentedControl
                value={tab}
                onChange={setTab}
                aria-label="How to connect an assistant"
              >
                {tabs.map(({ value, label }) => (
                  <SegmentedControl.Item key={value} value={value}>
                    {label}
                  </SegmentedControl.Item>
                ))}
              </SegmentedControl>
            </div>
            <div className={styles.installBody}>
              <Snippet
                key={current.value}
                text={current.code}
                symbol={current.symbol}
                width="100%"
              />
              <ol className={styles.steps}>
                {current.steps.map((step, index) => (
                  <li key={step} className={styles.step}>
                    <span className={styles.stepNumber}>{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <NextLink href={current.href} className={styles.learnMore}>
                Read the guide
                <ArrowRight fontSize={16} />
              </NextLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default SectionAgents
