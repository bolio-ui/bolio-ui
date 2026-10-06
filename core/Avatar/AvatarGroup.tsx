import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './AvatarGroup.module.css'

interface Props {
  count?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type AvatarGroupProps = Props & NativeAttrs

function AvatarGroupComponent({
  count,
  className = '',
  children
}: AvatarGroupProps) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const groupStyle: React.CSSProperties = {
    width: SCALES.width(1, 'max-content'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--avatar-group-overlap': `-${SCALES.ml(0.625)}`
  } as React.CSSProperties

  return (
    <div
      className={useClasses(styles.avatarGroup, className)}
      style={groupStyle}
    >
      {children}
      {count && (
        <span
          className={styles.count}
          style={{
            fontSize: SCALES.font(0.875),
            color: theme.palette.accents_7
          }}
        >
          +{count}
        </span>
      )}
    </div>
  )
}

AvatarGroupComponent.displayName = 'BolioUIAvatarGroup'
const AvatarGroup = withScale(AvatarGroupComponent)
export default AvatarGroup
