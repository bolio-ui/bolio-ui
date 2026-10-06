import React, { useEffect, useId } from 'react'
import CollapseIcon from './CollapseIcon'
import useTheme from '../use-theme'
import Expand from '../Shared/expand'
import { useCollapseContext } from './CollapseContext'
import useCurrentState from '../utils/use-current-state'
import logWarning from '../utils/log-warning'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Collapse.module.css'

interface Props {
  title: string
  subtitle?: React.ReactNode | string
  initialVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  disabled?: boolean
  shadow?: boolean
  className?: string
  index?: number
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type CollapseProps = Props & NativeAttrs

const CollapseComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<CollapseProps>
>(
  (
    {
      children,
      title,
      subtitle,
      initialVisible = false,
      visible: controlledVisible,
      onVisibleChange,
      disabled = false,
      shadow = false,
      className = '',
      index,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const { values, updateValues } = useCollapseContext()
    const [selfVisible, setVisible, visibleRef] =
      useCurrentState<boolean>(initialVisible)
    const isControlled = controlledVisible !== undefined
    const visible = isControlled ? controlledVisible : selfVisible
    const baseId = useId()
    const triggerId = `${baseId}-trigger`
    const panelId = `${baseId}-panel`

    if (!title) {
      logWarning('"title" is required.', 'Collapse')
    }

    useEffect(() => {
      if (!values.length) return
      const isActive = !!values.find((item) => item === index)
      setVisible(isActive)
    }, [index, setVisible, values])

    const clickHandler = () => {
      if (disabled) return
      const next = !(isControlled ? controlledVisible : visibleRef.current)
      if (!isControlled) setVisible(next)
      if (onVisibleChange) onVisibleChange(next)
      if (updateValues) updateValues(index, next)
    }

    const collapseStyle: React.CSSProperties = shadow
      ? {
          boxShadow: theme.expressiveness.shadowSmall,
          border: 'none',
          borderRadius: theme.layout.radius,
          padding: theme.layout.gap,
          fontSize: SCALES.font(1),
          width: SCALES.width(1, 'auto'),
          height: SCALES.height(1, 'auto'),
          margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
        }
      : {
          borderTop: `1px solid ${theme.palette.border}`,
          borderBottom: `1px solid ${theme.palette.border}`,
          fontSize: SCALES.font(1),
          width: SCALES.width(1, 'auto'),
          height: SCALES.height(1, 'auto'),
          padding: `${SCALES.pt(1.2)} ${SCALES.pr(0)} ${SCALES.pb(1.2)} ${SCALES.pl(0)}`,
          margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
        }

    return (
      <div
        ref={ref}
        className={useClasses('collapse', className)}
        {...props}
        style={{ ...collapseStyle, ...style }}
      >
        <div
          className={styles.view}
          onClick={clickHandler}
          style={
            {
              '--collapse-focus-color': theme.palette.primary,
              cursor: disabled ? 'not-allowed' : undefined
            } as React.CSSProperties
          }
        >
          <h3 className={styles.title}>
            <button
              type="button"
              id={triggerId}
              className={styles.trigger}
              data-collapse-trigger=""
              aria-expanded={visible}
              aria-controls={panelId}
              disabled={disabled}
              style={{ color: theme.palette.foreground }}
            >
              <span className={styles.label}>{title}</span>
              <CollapseIcon active={visible} />
            </button>
          </h3>
          {subtitle && (
            <div
              className={styles.subtitle}
              style={{ color: theme.palette.accents_5 }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <Expand isExpanded={visible}>
          <div
            id={panelId}
            className={styles.content}
            style={{
              padding: `${SCALES.pt(0.6)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`
            }}
          >
            {children}
          </div>
        </Expand>
      </div>
    )
  }
)

CollapseComponent.displayName = 'BolioUICollapse'
const Collapse = withScale(CollapseComponent)
export default Collapse
