import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import useTheme from '../use-theme'
import useClickAway from '../utils/use-click-away'
import { getColor } from './styles'
import ButtonDropdownIcon from './Icon'
import ButtonDropdownItem from './ButtonDropdownItem'
import {
  ButtonDropdownContext,
  ButtonDropdownAlign
} from './ButtonDropdownContext'
import { NormalTypes } from '../utils/prop-types'
import { pickChild, pickChildByProps } from '../utils/collections'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './ButtonDropdown.module.css'
import { getSurface } from '../utils/surface'

export type ButtonDropdownTypes = NormalTypes

interface Props {
  type?: ButtonDropdownTypes
  auto?: boolean
  // where the label of the main button sits when it is wider than its text
  align?: ButtonDropdownAlign
  loading?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type ButtonDropdownProps = Props & NativeAttrs

const stopPropagation = (event: MouseEvent<HTMLElement>) => {
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()
}

const ButtonDropdownComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ButtonDropdownProps>
>(
  (
    {
      children,
      type = 'default' as ButtonDropdownTypes,
      auto = false,
      align = 'center',
      className = '',
      disabled = false,
      loading = false,
      icon,
      style,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const { SCALES } = useScale()
    const innerRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement)
    const theme = useTheme()
    const surface = getSurface(theme)

    const colors = getColor(theme.palette, type)
    const itemChildren = pickChild(children, ButtonDropdownItem)[1]
    const [itemChildrenWithoutMain, mainItemChildren] = pickChildByProps(
      itemChildren,
      'main',
      true
    )

    const [visible, setVisible] = useState<boolean>(false)
    const summaryRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    // ArrowDown on the summary opens the list and lands on its first item
    const focusFirst = useRef(false)

    const items = () =>
      Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled)'
        ) ?? []
      )

    useEffect(() => {
      if (!visible || !focusFirst.current) return
      focusFirst.current = false
      contentRef.current
        ?.querySelector<HTMLElement>('button:not(:disabled)')
        ?.focus()
    }, [visible])

    const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) onKeyDown(event)
      if (disabled || loading || event.defaultPrevented) return
      const { key, target } = event
      if (key === 'Escape' && visible) {
        event.preventDefault()
        setVisible(false)
        summaryRef.current?.focus()
        return
      }
      if (key !== 'ArrowDown' && key !== 'ArrowUp') return
      if (target === summaryRef.current) {
        if (key !== 'ArrowDown') return
        event.preventDefault()
        if (visible) items()[0]?.focus()
        else {
          focusFirst.current = true
          setVisible(true)
        }
        return
      }
      const list = items()
      const current = list.indexOf(target as HTMLElement)
      if (current < 0) return
      event.preventDefault()
      if (key === 'ArrowDown')
        list[Math.min(list.length - 1, current + 1)].focus()
      else if (current === 0) summaryRef.current?.focus()
      else list[current - 1].focus()
    }
    const clickHandler = useCallback(
      (event: MouseEvent<HTMLDetailsElement>) => {
        event.preventDefault()
        stopPropagation(event)
        if (disabled || loading) return
        setVisible(!visible)
      },
      [disabled, loading, visible]
    )

    const initialValue = {
      type,
      auto,
      disabled,
      loading,
      align,
      close: () => setVisible(false)
    }
    const bgColor = useMemo(() => {
      if (disabled || loading) return theme.palette.accents_2
      return visible ? colors.hoverBgColor : colors.bgColor
    }, [
      disabled,
      loading,
      theme.palette.accents_2,
      visible,
      colors.hoverBgColor,
      colors.bgColor
    ])
    const [paddingLeft, paddingRight] = [
      auto ? SCALES.pl(1.15) : SCALES.pl(1.375),
      auto ? SCALES.pr(1.15) : SCALES.pr(1.375)
    ]

    useClickAway(innerRef, () => setVisible(false))

    const rootStyle = {
      '--dropdown-radius': theme.layout.radius,
      '--dropdown-border-color':
        type === 'default' ? theme.palette.border : colors.borderColor,
      '--bolio-ui-dropdown-height': SCALES.height(2.5),
      '--bolio-ui-dropdown-min-width': auto
        ? 'min-content'
        : SCALES.width(10.5),
      '--bolio-ui-dropdown-padding': `${SCALES.pt(0)} ${paddingRight} ${SCALES.pb(0)} ${paddingLeft}`,
      '--bolio-ui-dropdown-font-size': SCALES.font(0.875),
      '--bolio-ui-dropdown-focus': theme.palette.primary,
      ...style
    } as React.CSSProperties

    return (
      <ButtonDropdownContext.Provider value={initialValue}>
        <div
          ref={innerRef}
          className={useClasses(styles.btnDropdown, className)}
          onClick={stopPropagation}
          {...props}
          onKeyDown={keyDownHandler}
          style={rootStyle}
        >
          {mainItemChildren}
          <details className={styles.details} open={visible}>
            <summary
              ref={summaryRef}
              className={styles.summary}
              aria-label="More options"
              onClick={clickHandler}
              style={{
                color: colors.color,
                backgroundColor: bgColor,
                cursor: disabled || loading ? 'not-allowed' : 'pointer'
              }}
            >
              <div className={styles.dropdownBox}>
                {icon ? (
                  <span
                    className={styles.dropdownIcon}
                    style={{
                      color:
                        disabled || loading
                          ? theme.palette.error
                          : colors.color,
                      height: SCALES.height(2.5),
                      width: SCALES.height(2.5)
                    }}
                  >
                    {icon}
                  </span>
                ) : (
                  <ButtonDropdownIcon
                    color={
                      disabled || loading
                        ? theme.palette.accents_4
                        : colors.color
                    }
                    height={SCALES.height(2.5)}
                  />
                )}
              </div>
            </summary>
            <div
              ref={contentRef}
              className={styles.content}
              style={{
                boxShadow: surface.shadow,
                transform: 'translateY(4px)',
                backgroundColor:
                  type === 'default' ? surface.bg : colors.bgColor
              }}
            >
              {itemChildrenWithoutMain}
            </div>
          </details>
        </div>
      </ButtonDropdownContext.Provider>
    )
  }
)

ButtonDropdownComponent.displayName = 'BolioUIButtonDropdown'
const ButtonDropdown = withScale(ButtonDropdownComponent)
export default ButtonDropdown
