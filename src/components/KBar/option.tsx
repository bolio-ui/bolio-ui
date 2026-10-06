import React, { useCallback } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import { useTheme, Keyboard } from 'core'
import { addColorAlpha } from 'core/utils/color'
import * as Icons from '@bolio-ui/icons'
import { isEmpty } from 'lodash'
import { Action, ResultHandlers, ResultState } from './types'
import styles from './option.module.css'

type Icon = keyof typeof Icons

interface Props {
  action: Action
  handlers: ResultHandlers
  state: ResultState
}

const KBarOption: React.FC<Props> = ({ action, handlers, state }) => {
  const ownRef = React.useRef<HTMLLIElement>(null)
  const active = state.index === state.activeIndex
  const theme = useTheme()

  React.useEffect(() => {
    if (active) {
      // wait for the KBarAnimator to resize, _then_ scrollIntoView.
      // https://medium.com/@owencm/one-weird-trick-to-performant-touch-response-animations-with-react-9fe4a0838116
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          const element = ownRef.current
          if (!element) {
            return
          }
          element.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
            inline: 'start'
          })
        })
      )
    }
  }, [active])

  const renderIcon = useCallback(() => {
    const CurrentIcon = Icons[action.icon as Icon]

    if (isEmpty(action.icon)) {
      return (
        <div className={styles.icon}>
          <Icons.ChevronRight
            stroke={
              active ? theme?.palette?.accents_7 : theme?.palette?.accents_6
            }
            name="chevron-right"
          />
        </div>
      )
    }

    if (
      action.icon &&
      typeof action.icon === 'string' &&
      action.icon.includes('.svg')
    ) {
      return (
        <div className={styles.icon}>
          <Image
            width={24}
            height={24}
            src={action.icon?.replace(
              '.svg',
              theme.type === 'dark' ? '-dark.svg' : '-light.svg'
            )}
            alt={`${action.name} icon`}
          />
        </div>
      )
    } else if (action.icon && typeof action.icon === 'string') {
      return (
        <div className={styles.icon}>
          <CurrentIcon
            stroke={
              active ? theme?.palette?.accents_7 : theme?.palette?.accents_6
            }
            name={action.icon}
          />
        </div>
      )
    }
    return <div className={styles.icon}>{action.icon}</div>
  }, [
    action.icon,
    action.name,
    active,
    theme?.palette?.accents_6,
    theme?.palette?.accents_7,
    theme.type
  ])

  return (
    <li
      ref={ownRef}
      className={styles.option}
      style={
        {
          '--option-active-bg': addColorAlpha(theme?.palette?.secondary, 0.1),
          '--option-foreground': theme?.palette?.foreground,
          '--option-muted': theme?.palette?.accents_7
        } as React.CSSProperties
      }
      {...handlers}
    >
      <div className={cn(styles.container, { [styles.active]: active })}>
        <div className={styles.left}>
          {renderIcon()}
          <div className={styles.text}>
            <span className={styles.title}>{action.name}</span>
            {action.subtitle && (
              <span className={styles.subtitle}>{action.subtitle}</span>
            )}
          </div>
        </div>
        <div className={styles.right}>
          {action.shortcut?.length ? (
            <div className={styles.kbd}>
              {action.shortcut.map((sc, index) => (
                <Keyboard key={`${sc}_${index}`}>{sc}</Keyboard>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  )
}

const MemoKBarOption = React.memo(KBarOption)

export default MemoKBarOption
