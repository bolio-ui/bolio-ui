import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  count?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type AvatarGroupProps = Props & NativeAttrs

function AvatarGroupComponent({
  count,
  className = '',
  children
}: AvatarGroupProps) {
  const theme = useTheme()
  const { SCALES } = useScale()

  return (
    <div className={useClasses('avatar-group', className)}>
      {children}
      {count && <span className="count">+{count}</span>}
      <style jsx>{`
        .avatar-group {
          display: flex;
          align-items: center;
          width: ${SCALES.width(1, 'max-content')};
          height: ${SCALES.height(1, 'auto')};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }

        .avatar-group :global(.avatar) {
          margin-left: -${SCALES.ml(0.625)};
        }

        .count {
          font-size: ${SCALES.font(0.875)};
          display: inline-flex;
          align-items: center;
          padding-left: 5.5px;
          color: ${theme.palette.accents_7};
        }
      `}</style>
    </div>
  )
}

AvatarGroupComponent.displayName = 'BolioUIAvatarGroup'
const AvatarGroup = withScale(AvatarGroupComponent)
export default AvatarGroup
