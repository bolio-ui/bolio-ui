import React, { useMemo } from 'react'
import { getIconPosition } from './placement'
import { Placement } from '../utils/prop-types'
import styles from './TooltipIcon.module.css'

interface Props {
  placement: Placement
  shadow: boolean
}

const TooltipIcon: React.FC<Props> = ({ placement }) => {
  const { transform, top, left, right, bottom } = useMemo(
    () =>
      getIconPosition(
        placement,
        'var(--tooltip-icon-offset-x)',
        'var(--tooltip-icon-offset-y)'
      ),
    [placement]
  )

  return (
    <span
      className={styles.icon}
      style={{ left, top, right, bottom, transform }}
    />
  )
}

export default TooltipIcon
