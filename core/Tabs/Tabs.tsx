import React, {
  CSSProperties,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import useTheme from '../use-theme'
import { TabsHeaderItem, TabsConfig, TabsContext } from './TabsContext'
import useScale, { withScale } from '../use-scale'
import Highlight from '../Shared/highlight'
import { useRect } from '../utils/layouts'
import { isBolioUIElement } from '../utils/collections'
import useClasses from '../use-classes'
import TabsItem, { TabsItemCell } from './TabsItem'

interface Props {
  initialValue?: string
  value?: string
  hideDivider?: boolean
  hideBorder?: boolean
  highlight?: boolean
  onChange?: (val: string) => void
  className?: string
  leftSpace?: CSSProperties['marginLeft']
  hoverHeightRatio?: number
  hoverWidthRatio?: number
  align?: CSSProperties['justifyContent']
  activeClassName?: string
  activeStyles?: CSSProperties
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type TabsProps = Props & NativeAttrs

// The Tabs.Item children (fragments included) and their props, read during
// render so the headers are in the first render and in the server HTML
const getDirectItems = (children: React.ReactNode): TabsHeaderItem[] =>
  React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<Record<string, unknown>>(child)) return []
    if (child.type === React.Fragment)
      return getDirectItems(child.props.children as React.ReactNode)
    if (child.type !== TabsItem) return []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children: panel, ...props } = child.props as TabsHeaderItem['props']
    return [{ value: props.value, props }]
  })

const TabsComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<TabsProps>
>(
  (
    {
      initialValue: userCustomInitialValue,
      value,
      hideDivider = false,
      hideBorder = false,
      children,
      onChange,
      className = '',
      leftSpace = '12px' as CSSProperties['marginLeft'],
      highlight = true,
      hoverHeightRatio = 0.7,
      hoverWidthRatio = 1.15,
      activeClassName = '',
      activeStyles,
      align = 'left',
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const [tabs, setTabs] = useState<Array<TabsHeaderItem>>([])
    const [selfValue, setSelfValue] = useState<string | undefined>(
      userCustomInitialValue
    )
    const headerRef = useRef<HTMLDivElement | null>(null)
    const [displayHighlight, setDisplayHighlight] = useState<boolean>(false)
    const { rect, setRect } = useRect()

    const register = (next: TabsHeaderItem) => {
      setTabs((last) => {
        const hasItem = last.find((item) => item.value === next.value)
        if (!hasItem) return [...last, next]
        return last.map((item) => {
          if (item.value !== next.value) return item
          return {
            ...item,
            ...next
          }
        })
      })
    }

    const directItems = getDirectItems(children)
    const directValues = directItems.map((item) => item.value)
    const directKey = directValues.join('\n')
    // items nested inside other components register themselves after mount
    const headers = [
      ...directItems,
      ...tabs.filter((item) => !directValues.includes(item.value))
    ]

    const initialValue = useMemo<TabsConfig>(
      () => ({
        register,
        currentValue: selfValue,
        inGroup: true,
        leftSpace,
        directValues
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [selfValue, leftSpace, directKey]
    )

    useEffect(() => {
      if (typeof value === 'undefined') return
      setSelfValue(value)
    }, [value])

    const clickHandler = (value: string) => {
      setSelfValue(value)
      onChange && onChange(value)
    }

    const tabItemMouseOverHandler = (event: MouseEvent<HTMLDivElement>) => {
      if (!isBolioUIElement(event.target as HTMLDivElement)) return
      setRect(event, () => headerRef.current)
      if (highlight) {
        setDisplayHighlight(true)
      }
    }

    return (
      <TabsContext.Provider value={initialValue}>
        <div className={useClasses('tabs', className)} ref={ref} {...props}>
          <header
            ref={headerRef}
            onMouseLeave={() => setDisplayHighlight(false)}
          >
            <Highlight
              rect={rect}
              visible={displayHighlight}
              hoverHeightRatio={hoverHeightRatio}
              hoverWidthRatio={hoverWidthRatio}
            />
            <div
              role="tablist"
              className={useClasses('scroll-container', {
                'hide-divider': hideDivider
              })}
            >
              {headers.map(({ value, props: itemProps }) => (
                <TabsItemCell
                  key={value}
                  {...itemProps}
                  onClick={clickHandler}
                  onMouseOver={tabItemMouseOverHandler}
                  activeClassName={activeClassName}
                  activeStyle={activeStyles}
                  hideBorder={hideBorder}
                />
              ))}
            </div>
          </header>
          <div className="content" role="tabpanel">
            {children}
          </div>
          <style jsx>{`
            .tabs {
              font-size: ${SCALES.font(1)};
              width: ${SCALES.width(1, 'initial')};
              height: ${SCALES.height(1, 'auto')};
              padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
                ${SCALES.pl(0)};
              margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
                ${SCALES.ml(0)};
            }
            header {
              display: flex;
              flex-wrap: nowrap;
              align-items: center;
              overflow-y: hidden;
              overflow-x: scroll;
              scrollbar-width: none;
              position: relative;
            }
            .scroll-container {
              width: 100%;
              height: 100%;
              flex: 1;
              display: flex;
              flex-wrap: nowrap;
              align-items: center;
              justify-content: ${align};
              border-bottom: 1px solid ${theme.palette.border};
              padding-left: ${leftSpace};
            }
            header::-webkit-scrollbar {
              display: none;
            }
            .hide-divider {
              border-color: transparent;
            }
            .content {
              padding-top: 0.625rem;
            }
          `}</style>
        </div>
      </TabsContext.Provider>
    )
  }
)

TabsComponent.displayName = 'BolioUITabs'
const Tabs = withScale(TabsComponent)
export default Tabs
