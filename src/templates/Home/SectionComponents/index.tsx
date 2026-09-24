import React from 'react'
import NextLink from 'next/link'
import { useTheme, Section, Container, Text } from 'core'
import * as Icons from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'

type Icon = keyof typeof Icons

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
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <div className="head">
          <div>
            <Eyebrow>Components</Eyebrow>
            <Text h2 my={0}>
              51 components. 13 hooks. 1 theme.
            </Text>
          </div>
          <NextLink href="/docs/components" className="all">
            All components →
          </NextLink>
        </div>
        <div className="grid">
          {cards.map((card) => {
            const CardIcon = Icons[card.icon]
            return (
              <NextLink
                key={card.title}
                href={`/docs/components/${card.title.toLowerCase()}`}
                className="card"
              >
                <div className="preview">{card.preview}</div>
                <div className="body">
                  <div className="title">
                    <span className="icon">
                      <CardIcon fontSize={16} />
                    </span>
                    {card.title}
                  </div>
                  <p className="description">{card.description}</p>
                </div>
              </NextLink>
            )
          })}
        </div>
      </Container>
      <style jsx>{`
        .head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 40px;
        }
        .head :global(.all) {
          flex-shrink: 0;
          font-family: ${theme.font.mono};
          font-size: 0.8rem;
          color: ${theme.palette.primary};
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .grid :global(.card) {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.accents_1};
          color: ${theme.palette.foreground};
          overflow: hidden;
          transition: border-color 200ms ease;
        }
        .grid :global(.card:hover) {
          border-color: ${theme.palette.accents_4};
        }
        .preview {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 180px;
          padding: 24px;
          box-sizing: border-box;
          border-bottom: 1px solid ${theme.palette.border};
          background: radial-gradient(
            ellipse at top,
            ${theme.palette.primary}1f,
            transparent 60%
          );
        }
        .body {
          padding: 16px 20px 20px;
        }
        .title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: ${theme.font.mono};
          font-size: 0.85rem;
          font-weight: 600;
        }
        .icon {
          display: inline-flex;
          padding: 6px;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
        }
        .description {
          margin: 12px 0 0;
          font-size: 0.85rem;
          line-height: 1.6;
          color: ${theme.palette.accents_5};
        }

        /* Wireframe primitives */
        .preview :global(.line) {
          display: block;
          height: 4px;
          border-radius: 2px;
          background-color: ${theme.palette.accents_3};
        }
        .preview :global(.line.strong) {
          background-color: ${theme.palette.accents_5};
        }
        .preview :global(.accent) {
          background-color: ${theme.palette.primary};
        }
        .preview :global(.accent-bg) {
          background-color: ${theme.palette.primary} !important;
        }
        .preview :global(.accent-border) {
          border-color: ${theme.palette.primary} !important;
        }
        .preview :global(.box) {
          display: flex;
          border: 1px solid ${theme.palette.border};
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.background};
        }
        .preview :global(.box.active) {
          border-color: ${theme.palette.primary};
          box-shadow: 0 0 24px ${theme.palette.primary}33;
        }
        .preview :global(.w-20) {
          width: 20%;
        }
        .preview :global(.w-30) {
          width: 30%;
        }
        .preview :global(.w-40) {
          width: 40%;
        }
        .preview :global(.w-50) {
          width: 50%;
        }
        .preview :global(.w-60) {
          width: 60%;
        }
        .preview :global(.w-70) {
          width: 70%;
        }
        .preview :global(.w-80) {
          width: 80%;
        }
        .preview :global(.w-100) {
          width: 100%;
        }

        /* Wireframe layouts */
        .preview :global(.stack) {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .preview :global(.stack.narrow) {
          width: 70%;
        }
        .preview :global(.stack-row) {
          display: flex;
          gap: 12px;
          width: 100%;
          justify-content: center;
        }
        .preview :global(.pill) {
          flex: 1;
          max-width: 90px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
        }
        .preview :global(.pill.small) {
          flex: none;
          width: 36px;
          height: 14px;
        }
        .preview :global(.pill.filled) {
          border-color: ${theme.palette.primary};
          background-color: ${theme.palette.primary};
        }
        .preview :global(.field) {
          align-items: center;
          justify-content: space-between;
          height: 30px;
          padding: 0 12px;
        }
        .preview :global(.caret) {
          width: 2px;
          height: 14px;
          margin-right: auto;
          margin-left: 4px;
          background-color: ${theme.palette.primary};
        }
        .preview :global(.menu) {
          flex-direction: column;
          gap: 10px;
          padding: 12px;
        }
        .preview :global(.option) {
          display: flex;
          margin: 0 -6px;
          padding: 6px;
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.primary}1f;
        }
        .preview :global(.backdrop) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: ${theme.layout.radius};
          background-color: ${theme.palette.accents_2};
        }
        .preview :global(.dialog) {
          flex-direction: column;
          gap: 8px;
          width: 60%;
          padding: 12px;
        }
        .preview :global(.dialog-actions) {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          margin-top: 4px;
        }
        .preview :global(.tabs) {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid ${theme.palette.border};
        }
        .preview :global(.tab) {
          display: flex;
          width: 48px;
          padding-bottom: 10px;
          margin-bottom: -1px;
          border-bottom: 2px solid transparent;
        }
        .preview :global(.tab-active) {
          border-bottom-color: ${theme.palette.primary};
        }
        .preview :global(.panel) {
          flex-direction: column;
          gap: 8px;
          padding: 12px;
        }
        .preview :global(.profile) {
          flex: 1;
          max-width: 90px;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 14px 10px;
        }
        .preview :global(.circle) {
          width: 26px;
          height: 26px;
          border: 1px solid ${theme.palette.accents_4};
          border-radius: 50%;
        }
        .preview :global(.switch) {
          position: relative;
          width: 24px;
          height: 12px;
          border-radius: 999px;
          background-color: ${theme.palette.accents_3};
        }
        .preview :global(.switch)::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${theme.palette.accents_6};
        }
        .preview :global(.switch.on) {
          background-color: ${theme.palette.primary};
        }
        .preview :global(.switch.on)::after {
          left: 14px;
          background-color: ${theme.palette.background};
        }
        .preview :global(.track) {
          display: block;
          height: 8px;
          border-radius: 999px;
          background-color: ${theme.palette.accents_2};
          overflow: hidden;
        }
        .preview :global(.fill) {
          display: block;
          height: 100%;
          border-radius: 999px;
          background-color: ${theme.palette.accents_4};
        }
        .preview :global(.calendar) {
          flex-direction: column;
          gap: 10px;
          padding: 12px;
        }
        .preview :global(.days) {
          display: grid;
          grid-template-columns: repeat(7, 14px);
          gap: 6px;
        }
        .preview :global(.day) {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          background-color: ${theme.palette.accents_2};
        }

        @media (max-width: ${theme.breakpoints.md.max}) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .head {
            flex-direction: column;
            align-items: flex-start;
          }
          .grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </Section>
  )
}

export default SectionComponents
