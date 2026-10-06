import React, { useCallback, useMemo } from 'react'
import Collapse from './Collapse'
import useCurrentState from '../utils/use-current-state'
import { setChildrenIndex } from '../utils/collections'
import { CollapseContext, CollapseConfig } from './CollapseContext'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './CollapseGroup.module.css'

interface Props {
  accordion?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type CollapseGroupProps = Props & NativeAttrs

function CollapseGroupComponent({
  children,
  accordion = true,
  className = '',
  style,
  onKeyDown,
  ...props
}: React.PropsWithChildren<CollapseGroupProps>) {
  const { SCALES } = useScale()

  const [state, setState, stateRef] = useCurrentState<Array<number>>([])
  const classes = useClasses(styles.collapseGroup, className)

  const updateValues = useCallback(
    (currentIndex: number, nextState: boolean) => {
      const hasChild = stateRef.current.find((val) => val === currentIndex)
      if (accordion) {
        if (nextState) return setState([currentIndex])
        return setState([])
      }

      if (nextState) {
        if (hasChild) return
        return setState([...stateRef.current, currentIndex])
      }
      setState(stateRef.current.filter((item) => item !== currentIndex))
    },
    [accordion, stateRef, setState]
  )

  const initialValue = useMemo<CollapseConfig>(
    () => ({
      values: state,
      updateValues
    }),
    [state, updateValues]
  )
  const hasIndexChildren = useMemo(
    () => setChildrenIndex(children, [Collapse]),
    [children]
  )

  // arrows, Home and End move focus between the headers of the group
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) onKeyDown(event)
    const { key } = event
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return
    const triggers = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[data-collapse-trigger]'
      )
    ).filter((trigger) => !trigger.disabled)
    const current = triggers.indexOf(event.target as HTMLButtonElement)
    if (current < 0) return

    event.preventDefault()
    const last = triggers.length - 1
    const next =
      key === 'Home'
        ? 0
        : key === 'End'
          ? last
          : key === 'ArrowDown'
            ? (current + 1) % triggers.length
            : (current + last) % triggers.length
    triggers[next].focus()
  }

  const groupStyle: React.CSSProperties = {
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0.6)} ${SCALES.pb(0)} ${SCALES.pl(0.6)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <CollapseContext.Provider value={initialValue}>
      <div
        className={classes}
        {...props}
        onKeyDown={keyDownHandler}
        style={groupStyle}
      >
        {hasIndexChildren}
      </div>
    </CollapseContext.Provider>
  )
}

CollapseGroupComponent.displayName = 'BolioUICollapseGroup'
const CollapseGroup = withScale(CollapseGroupComponent)
export default CollapseGroup
