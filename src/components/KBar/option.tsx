import React, { useCallback } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import { useTheme, Keyboard } from 'core'
import { addColorAlpha } from 'core/utils/color'
import * as Icons from '@bolio-ui/icons'
import { isEmpty } from 'lodash'
import { Action, ResultHandlers, ResultState } from './types'

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
        <div className="option-icon">
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
        <div className="option-icon">
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
        <div className="option-icon">
          <CurrentIcon
            stroke={
              active ? theme?.palette?.accents_7 : theme?.palette?.accents_6
            }
            name={action.icon}
          />
        </div>
      )
    }
    return <div className="option-icon">{action.icon}</div>
  }, [
    action.icon,
    action.name,
    active,
    theme?.palette?.accents_6,
    theme?.palette?.accents_7,
    theme.type
  ])

  return (
    <li ref={ownRef} className="kbar-option" {...handlers}>
      <div className={cn('option-container', { active })}>
        <div className="option-left-container">
          {renderIcon()}
          <div className="option-text-container">
            <span className="option-text-title">{action.name}</span>
            {action.subtitle && (
              <span className="option-text-subtitle">{action.subtitle}</span>
            )}
          </div>
        </div>
        <div className="option-right-container">
          {action.shortcut?.length ? (
            <div className="kbd-container">
              {action.shortcut.map((sc, index) => (
                <Keyboard key={`${sc}_${index}`}>{sc}</Keyboard>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>
        {`
          .kbar-option {
            width: 100%;
            min-height: 54px;
          }
          .option-container {
            display: flex;
            height: 54px;
            padding: 0 10px;
            margin: 4px 12px;
            align-items: center;
            cursor: pointer;
            justify-content: space-between;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
          .active {
            background: ${addColorAlpha(theme?.palette?.violet, 0.1)};
          }
          .option-left-container {
            display: flex;
            align-items: center;
          }
          :global(.option-icon) {
            display: flex;
            align-items: center;
            padding-right: 12px;
          }
          .option-text-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .option-right-container {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .option-text-title {
            color: ${theme?.palette?.foreground};
          }
          .option-text-subtitle {
            font-size: 12px;
            color: ${theme?.palette?.accents_7};
          }
          .kbd-container {
            display: grid;
            grid-auto-flow: column;
            gap: 4px;
          }
        `}
      </style>
    </li>
  )
}

const MemoKBarOption = React.memo(KBarOption)

export default MemoKBarOption
