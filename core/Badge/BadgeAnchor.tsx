import React, { useMemo } from 'react'
import { pickChild } from '../utils/collections'
import Badge from './Badge'
import type { AnyElement } from '../utils/types'
import styles from './BadgeAnchor.module.css'

export type BadgeAnchorPlacement =
  'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

interface Props {
  placement?: BadgeAnchorPlacement
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type BadgeAnchorProps = Props & NativeAttrs

type TransformStyles = {
  top?: string
  bottom?: string
  left?: string
  right?: string
  value: string
  origin: string
}

const getTransform = (placement: BadgeAnchorPlacement): TransformStyles => {
  const styles: { [key in BadgeAnchorPlacement]: TransformStyles } = {
    topLeft: {
      top: '0',
      left: '0',
      value: 'translate(-50%, -50%)',
      origin: '0% 0%'
    },
    topRight: {
      top: '0',
      right: '0',
      value: 'translate(50%, -50%)',
      origin: '100% 0%'
    },
    bottomLeft: {
      left: '0',
      bottom: '0',
      value: 'translate(-50%, 50%)',
      origin: '0% 100%'
    },
    bottomRight: {
      right: '0',
      bottom: '0',
      value: 'translate(50%, 50%)',
      origin: '100% 100%'
    }
  }
  return styles[placement]
}

function BadgeAnchor({
  children,
  placement = 'topRight' as BadgeAnchorPlacement
}: BadgeAnchorProps) {
  const [withoutBadgeChildren, badgeChldren] = pickChild(children, Badge)
  const { top, bottom, left, right, value, origin } = useMemo(
    () => getTransform(placement),
    [placement]
  )

  return (
    <div className={styles.anchor}>
      {withoutBadgeChildren}
      <sup
        className={styles.sup}
        style={{
          top: top || 'auto',
          left: left || 'auto',
          right: right || 'auto',
          bottom: bottom || 'auto',
          transform: value,
          transformOrigin: origin
        }}
      >
        {badgeChldren}
      </sup>
    </div>
  )
}

BadgeAnchor.displayName = 'BolioUIBadgeAnchor'
export default BadgeAnchor
