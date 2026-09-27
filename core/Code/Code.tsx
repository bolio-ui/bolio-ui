import React, { useMemo } from 'react'
import useScale, { withScale } from '../use-scale'
import useTheme from '../use-theme'
import { addColorAlpha } from '../utils/color'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Code.module.css'

interface Props {
  block?: boolean
  className?: string
  name?: string
  classic?: boolean
  tabs?: string[]
  activeTab?: number
  onTabChange?: (index: number) => void
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
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

    const nameStyle: React.CSSProperties = {
      borderRight: `1px solid ${theme.palette.accents_2}`,
      color: theme.palette.accents_5,
      fontSize: SCALES.font(0.8125),
      padding: `${SCALES.font(0.32)} ${SCALES.font(0.5)} ${SCALES.font(0.32)} ${SCALES.font(0.5)}`
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={styles.pre}
        style={
          {
            border: `1px solid ${border}`,
            fontSize: SCALES.font(0.875),
            width: SCALES.width(1, 'initial'),
            height: SCALES.height(1, 'auto'),
            margin: `${SCALES.mt(1.3)} ${SCALES.mr(0)} ${SCALES.mb(1.3)} ${SCALES.ml(0)}`,
            borderRadius: theme.layout.radius,
            backgroundColor: background,
            '--code-tab-hover-color': theme.palette.foreground,
            '--code-tab-focus-color': theme.palette.accents_5
          } as React.CSSProperties
        }
      >
        <header
          style={{
            borderBottom: `1px solid ${theme.palette.accents_2}`,
            backgroundColor: theme.palette.border
          }}
        >
          <div
            className={styles.traffic}
            style={{ padding: `0 ${theme.layout.gapHalf}` }}
          >
            <span className={styles.close} />
            <span className={styles.mini} />
            <span className={styles.full} />
          </div>
          {hasTabs ? (
            <div role="tablist" className={styles.tabs}>
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
                  className={useClasses(styles.name, styles.tab, {
                    [styles.active]: index === activeTab
                  })}
                  style={{
                    ...nameStyle,
                    backgroundColor: index === activeTab ? tab : undefined
                  }}
                  onClick={() => onTabChange?.(index)}
                  onKeyDown={(event) => moveTab(event, index)}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ) : (
            name && (
              <div
                className={useClasses(styles.name, styles.active)}
                style={{ ...nameStyle, backgroundColor: tab }}
              >
                {name}
              </div>
            )
          )}
        </header>
        <pre
          className={className}
          style={{
            padding: `${SCALES.pt(1.1)} ${SCALES.pr(1)} ${SCALES.pb(1.1)} ${SCALES.pl(1)}`
          }}
          {...(hasTabs && {
            role: 'tabpanel',
            id: `${id}-panel`,
            'aria-labelledby': `${id}-tab-${activeTab}`
          })}
          {...props}
        >
          {children}
        </pre>
      </div>
    )
  }
)

CodeComponent.displayName = 'BolioUICode'
const Code = withScale(CodeComponent)
export default Code
