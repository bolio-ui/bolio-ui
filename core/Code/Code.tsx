import React, { useMemo } from 'react'
import useScale, { withScale } from '../use-scale'
import useTheme from '../use-theme'
import { addColorAlpha } from '../utils/color'

interface Props {
  block?: boolean
  className?: string
  name?: string
  classic?: boolean
  tabs?: string[]
  activeTab?: number
  onTabChange?: (index: number) => void
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type CodeProps = Props & NativeAttrs

const CodeComponent = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<CodeProps>
>(
  (
    {
      children,
      block = false,
      className = '',
      name = '',
      classic = false,
      tabs = [],
      activeTab = 0,
      onTabChange,
      ...props
    },
    ref
  ) => {
    const { SCALES } = useScale()
    const theme = useTheme()
    const id = React.useId()
    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([])

    const { background, border, tab } = useMemo(() => {
      if (!classic)
        return {
          border: theme.palette.accents_2,
          background: addColorAlpha(theme.palette.accents_1, 0.75),
          tab: theme.palette.accents_1
        }
      return {
        border: theme.palette.accents_2,
        background: theme.palette.background,
        tab: theme.palette.background
      }
    }, [classic, theme.palette])

    const hasTabs = tabs.length > 0

    const moveTab = (event: React.KeyboardEvent, index: number) => {
      const last = tabs.length - 1
      const target = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last
      }[event.key]
      if (target === undefined) return
      event.preventDefault()
      onTabChange?.(target)
      tabRefs.current[target]?.focus()
    }

    if (!block)
      return (
        <code ref={ref} {...props}>
          {children}
        </code>
      )

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className="pre">
        <header>
          <div className="traffic">
            <span className="close" />
            <span className="mini" />
            <span className="full" />
          </div>
          {hasTabs ? (
            <div role="tablist" className="tabs">
              {tabs.map((label, index) => (
                <button
                  key={`${label}-${index}`}
                  ref={(element) => {
                    tabRefs.current[index] = element
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${index}`}
                  aria-selected={index === activeTab}
                  aria-controls={`${id}-panel`}
                  tabIndex={index === activeTab ? 0 : -1}
                  className={`name tab${index === activeTab ? ' active' : ''}`}
                  onClick={() => onTabChange?.(index)}
                  onKeyDown={(event) => moveTab(event, index)}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ) : (
            name && <div className="name active">{name}</div>
          )}
        </header>
        <pre
          className={className}
          {...(hasTabs && {
            role: 'tabpanel',
            id: `${id}-panel`,
            'aria-labelledby': `${id}-tab-${activeTab}`
          })}
          {...props}
        >
          {children}
        </pre>
        <style jsx>{`
          .pre {
            max-width: 100%;
            border: 1px solid ${border};
            font-size: ${SCALES.font(0.875)};
            width: ${SCALES.width(1, 'initial')};
            height: ${SCALES.height(1, 'auto')};
            margin: ${SCALES.mt(1.3)} ${SCALES.mr(0)} ${SCALES.mb(1.3)}
              ${SCALES.ml(0)};
            border-radius: ${theme.layout.radius};
            background-color: ${background};
            overflow: hidden;
          }
          pre {
            max-width: 100%;
            font-size: inherit;
            border: none;
            border-radius: 0;
            margin: 0;
            line-height: 1.5em;
            padding: ${SCALES.pt(1.1)} ${SCALES.pr(1)} ${SCALES.pb(1.1)}
              ${SCALES.pl(1)};
          }
          .dark {
            color: white;
            background: black;
          }
          .dark code {
            color: white;
          }
          header {
            height: 2.5em;
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid ${theme.palette.accents_2};
            background-color: ${theme.palette.border};
          }
          .traffic {
            display: flex;
            align-items: center;
            padding: 0 ${theme.layout.gapHalf};
            user-select: none;
          }
          .traffic span {
            border-radius: 50%;
            width: 0.75em;
            height: 0.75em;
            max-width: 12px;
            max-height: 12px;
            display: inline-block;
            margin-right: 0.5em;
          }
          .traffic .close {
            background-color: #ff5f56;
          }
          .traffic .mini {
            background-color: #ffbd2e;
          }
          .traffic .full {
            background-color: #27c93f;
          }
          .tabs {
            display: flex;
            max-width: 100%;
          }
          .tab {
            min-width: 0;
          }
          .tab span {
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .name {
            margin-bottom: -1px;
            border: none;
            border-right: 1px solid ${theme.palette.accents_2};
            background-color: transparent;
            color: ${theme.palette.accents_5};
            height: auto;
            line-height: 1.35em;
            display: inline-flex;
            align-items: center;
            font-size: ${SCALES.font(0.8125)};
            padding: ${SCALES.font(0.32)} ${SCALES.font(0.5)}
              ${SCALES.font(0.32)} ${SCALES.font(0.5)};
            width: auto;
            white-space: nowrap;
          }
          .name.active {
            background-color: ${tab};
          }
          .tab {
            font-family: inherit;
            cursor: pointer;
          }
          .tab:hover,
          .tab.active {
            color: ${theme.palette.foreground};
          }
          .tab:focus-visible {
            outline: 2px solid ${theme.palette.accents_5};
            outline-offset: -2px;
          }
        `}</style>
      </div>
    )
  }
)

CodeComponent.displayName = 'BolioUICode'
const Code = withScale(CodeComponent)
export default Code
