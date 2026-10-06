import React from 'react'
import useTheme from '../use-theme'
import styles from './AvatarSkeleton.module.css'

interface Props {
  opacity?: number
}

export type AvatarSkeletonProps = Props

const AvatarSkeleton: React.FC<AvatarSkeletonProps> = React.memo(
  ({ opacity = 0.5, ...props }: AvatarSkeletonProps) => {
    const theme = useTheme()
    return (
      <div
        {...props}
        className={styles.skeleton}
        style={{
          backgroundImage: `linear-gradient(270deg, ${theme.palette.accents_1}, ${theme.palette.accents_2}, ${theme.palette.accents_2}, ${theme.palette.accents_1})`,
          opacity
        }}
      />
    )
  }
)

AvatarSkeleton.displayName = 'BolioUIAvatarSkeleton'
export default AvatarSkeleton
