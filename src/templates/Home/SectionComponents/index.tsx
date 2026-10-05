import React from 'react'
import NextLink from 'next/link'
import { useTheme, Section, Container, Text } from 'core'
import * as Icons from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'
import docsManifest from 'src/content/docs/manifest.json'
import styles from './SectionComponents.module.css'

type Icon = keyof typeof Icons

const countRoutes = (title: string) =>
  docsManifest.routes[0].routes
    .find((group) => group.title === title)
    ?.routes?.filter((route) => route.title !== 'Overview').length ?? 0

const glows = new WeakMap<
  HTMLElement,
  { x: number; y: number; tx: number; ty: number; raf: number }
>()

function followPointer(el: HTMLElement, tx: number, ty: number) {
  const glow = glows.get(el) ?? { x: 50, y: 0, tx, ty, raf: 0 }
  glows.set(el, glow)
  glow.tx = tx
  glow.ty = ty
  if (glow.raf) return
  const step = () => {
    glow.x += (glow.tx - glow.x) * 0.12
    glow.y += (glow.ty - glow.y) * 0.12
    el.style.setProperty('--x', `${glow.x}%`)
    el.style.setProperty('--y', `${glow.y}%`)
    const moving =
      Math.abs(glow.tx - glow.x) > 0.05 || Math.abs(glow.ty - glow.y) > 0.05
    glow.raf = moving ? requestAnimationFrame(step) : 0
  }
  glow.raf = requestAnimationFrame(step)
}

// Wireframes are built from three primitives: .line, .box and .active.
const cards: Array<{
  title: string
  icon: Icon
  description: string
  preview: React.ReactNode
}> = [
  {
    title: 'Button',
    icon: 'MousePointer',
    description: 'Types, sizes, icons and a loading state, all from the theme.',
    preview: (
      <div className="stack-row">
        <span className="box pill">
          <span className="line w-40" />
        </span>
        <span className="box pill active">
          <span className="line w-40 accent" />
        </span>
        <span className="box pill">
          <span className="line w-40" />
        </span>
      </div>
    )
  },
  {
    title: 'Input',
    icon: 'Type',
    description:
      'Labels, icons, clearable and password inputs with validation states.',
    preview: (
      <div className="stack">
        <span className="box field">
          <span className="line w-30" />
        </span>
        <span className="box field">
          <span className="line w-40" />
        </span>
        <span className="box field active">
          <span className="line w-50 accent" />
          <span className="caret" />
        </span>
      </div>
    )
  },
  {
    title: 'Select',
    icon: 'List',
    description:
      'Single or multiple choice, with a keyboard friendly dropdown.',
    preview: (
      <div className="stack narrow">
        <span className="box field active">
          <span className="line w-50 accent" />
        </span>
        <span className="box menu">
          <span className="line w-60" />
          <span className="option">
            <span className="line w-50 accent" />
          </span>
          <span className="line w-40" />
        </span>
      </div>
    )
  },
  {
    title: 'Modal',
    icon: 'Square',
    description:
      'Dialogs with title, content and actions, opened from any trigger.',
    preview: (
      <div className="backdrop">
        <span className="box dialog active">
          <span className="line w-40 strong" />
          <span className="line w-80" />
          <span className="line w-60" />
          <span className="dialog-actions">
            <span className="box pill small" />
            <span className="box pill small filled" />
          </span>
        </span>
      </div>
    )
  },
  {
    title: 'Tabs',
    icon: 'Columns',
    description:
      'Switch between views of the same content without leaving the page.',
    preview: (
      <div className="stack wide">
        <span className="tabs">
          {[false, true, false].map((active, index) => (
            <span key={index} className={`tab ${active ? 'tab-active' : ''}`}>
              <span className={`line w-100 ${active ? 'accent' : ''}`} />
            </span>
          ))}
        </span>
        <span className="box panel">
          <span className="line w-80" />
          <span className="line w-60" />
          <span className="line w-70" />
        </span>
      </div>
    )
  },
  {
    title: 'Avatar',
    icon: 'User',
    description: 'Pictures or initials, alone or stacked in a group.',
    preview: (
      <div className="stack-row">
        {[false, true, false].map((active, index) => (
          <span key={index} className={`box profile ${active ? 'active' : ''}`}>
            <span className={`circle ${active ? 'accent-border' : ''}`} />
            <span className="line w-60" />
            <span className="line w-40" />
          </span>
        ))}
      </div>
    )
  },
  {
    title: 'Toggle',
    icon: 'ToggleRight',
    description: 'On and off switches for settings, in every theme color.',
    preview: (
      <div className="stack narrow">
        {[false, true, false].map((on, index) => (
          <span key={index} className={`box field ${on ? 'active' : ''}`}>
            <span className={`line w-50 ${on ? 'accent' : ''}`} />
            <span className={`switch ${on ? 'on' : ''}`} />
          </span>
        ))}
      </div>
    )
  },
  {
    title: 'Progress',
    icon: 'Activity',
    description: 'Show how far a task has gone, with a color for each range.',
    preview: (
      <div className="stack narrow">
        {[30, 65, 90].map((value) => (
          <span key={value} className="track">
            <span
              className={`fill ${value === 65 ? 'accent-bg' : ''}`}
              style={{ width: `${value}%` }}
            />
          </span>
        ))}
      </div>
    )
  },
  {
    title: 'Calendar',
    icon: 'Calendar',
    description: 'Pick a date inline, or open it inside the DatePicker.',
    preview: (
      <span className="box calendar">
        <span className="line w-40 strong" />
        <span className="days">
          {Array.from({ length: 28 }, (_, index) => (
            <span
              key={index}
              className={`day ${index === 17 ? 'accent-bg' : ''}`}
            />
          ))}
        </span>
      </span>
    )
  }
]

function SectionComponents() {
  const theme = useTheme()

  return (
    <Section
      py={5}
      style={
        {
          '--mono': theme.font.mono,
          '--c-primary': theme.palette.primary,
          '--c-border': theme.palette.border,
          '--radius': theme.layout.radius,
          '--c-accents_1': theme.palette.accents_1,
          '--c-primary-1a': `${theme.palette.primary}1a`,
          '--c-primary-00': `${theme.palette.primary}00`,
          '--c-foreground': theme.palette.foreground,
          '--c-accents_4': theme.palette.accents_4,
          '--c-accents_2': theme.palette.accents_2,
          '--c-accents_5': theme.palette.accents_5,
          '--c-accents_3': theme.palette.accents_3,
          '--c-background': theme.palette.background,
          '--c-primary-33': `${theme.palette.primary}33`,
          '--c-primary-1f': `${theme.palette.primary}1f`,
          '--c-accents_6': theme.palette.accents_6
        } as React.CSSProperties
      }
    >
      <Container style={{ maxWidth: 1300 }}>
        <div className={styles.head}>
          <div>
            <Eyebrow>Components</Eyebrow>
            <Text h2 my={0}>
              {countRoutes('Components')} components. {countRoutes('Hooks')}{' '}
              hooks. Custom themes.
            </Text>
          </div>
          <NextLink href="/docs/components" className={styles.all}>
            All components →
          </NextLink>
        </div>
        <div className={styles.grid}>
          {cards.map((card) => {
            const CardIcon = Icons[card.icon]
            return (
              <NextLink
                key={card.title}
                href={`/docs/components/${card.title.toLowerCase()}`}
                className={styles.card}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  followPointer(
                    e.currentTarget,
                    ((e.clientX - rect.left) / rect.width) * 100,
                    ((e.clientY - rect.top) / rect.height) * 100
                  )
                }}
                onMouseLeave={(e) => followPointer(e.currentTarget, 50, 0)}
              >
                <div className={styles.preview}>{card.preview}</div>
                <div className={styles.body}>
                  <div className={styles.title}>
                    <span className={styles.icon}>
                      <CardIcon fontSize={16} />
                    </span>
                    {card.title}
                  </div>
                  <p className={styles.description}>{card.description}</p>
                </div>
              </NextLink>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

export default SectionComponents
