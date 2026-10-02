import React from 'react'
import useTheme from '../use-theme'
import styles from './ImageSkeleton.module.css'

interface Props {
  opacity?: number
}

export type ImageSkeletonProps = Props

const ImageSkeleton: React.FC<ImageSkeletonProps> = React.memo(
  ({ opacity = 0.5, ...props }: ImageSkeletonProps) => {
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

ImageSkeleton.displayName = 'BolioUIImageSkeleton'
export default ImageSkeleton
