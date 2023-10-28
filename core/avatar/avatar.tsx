import React, { useEffect, useRef, useState } from 'react'
import AvatarSkeleton from './avatar.skeleton'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  src?: string
  stacked?: boolean
  text?: string
  isSquare?: boolean
  className?: string
}

type NativeAttrs = Omit<
  Partial<React.ImgHTMLAttributes<any> & React.HTMLAttributes<any>>,
  keyof Props
>
export type AvatarProps = Props & NativeAttrs

const safeText = (text: string): string => {
  if (text.length <= 4) return text
  return text.slice(0, 3)
}

function AvatarComponent({
  src,
  stacked = false,
  text = '',
  isSquare = false,
  className = '',
  ...props
}: AvatarProps) {
  const theme = useTheme()
  const { SCALES, getScaleProps } = useScale()
  const showText = !src
  const radius = isSquare ? theme.layout.radius : '50%'
  const marginLeft = stacked ? SCALES.ml(-0.625) : SCALES.ml(0)
  const classes = useClasses('avatar', className)

  const width = getScaleProps(['width', 'w'])
  const height = getScaleProps(['height', 'h'])
  const showAnimation = width && height
  const [loading, setLoading] = useState<boolean>(true)
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true)
  const imageRef = useRef<HTMLImageElement>(null)

  const imageLoaded = () => {
    if (!showAnimation) return
    setLoading(false)
  }

  useEffect(() => {
    if (!showAnimation) return
    if (!imageRef.current) return
    if (imageRef.current.complete) {
      setLoading(false)
      setShowSkeleton(false)
    }
  }, [showAnimation])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showAnimation) {
        setShowSkeleton(false)
      }
      clearTimeout(timer)
    }, 3000)
    return () => clearTimeout(timer)
  }, [loading, showAnimation])

  return (
    <span className={classes}>
      {!showText && (
        <>
          {showSkeleton && showAnimation && (
            <AvatarSkeleton opacity={loading ? 1 : 0} />
          )}
          <img
            alt="Avatar"
            src={src}
            ref={imageRef}
            onLoad={imageLoaded}
            className="avatar-img"
            draggable={false}
            {...props}
          />
        </>
      )}
      {showText && (
        <span className="avatar-text" {...props}>
          {safeText(text)}
        </span>
      )}

      <style jsx>{`
        .avatar {
          display: inline-block;
          position: relative;
          overflow: hidden;
          border-radius: ${radius};
          vertical-align: top;
          background-color: ${theme.palette.accents_2};
          box-sizing: border-box;
          width: ${SCALES.width(1.75) || SCALES.height(1.75)};
          height: ${SCALES.height(1.75) || SCALES.width(1.75)};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${marginLeft};
        }

        .avatar-img {
          display: inline-block;
          object-fit: cover;
          width: 100%;
          height: 100%;
          border-radius: ${radius};
          user-select: none;
          text-align: center;
        }

        .avatar-text {
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: ${SCALES.font(1)};
          text-align: center;
          transform: translate(-50%, -50%) scale(0.65);
          white-space: nowrap;
          user-select: none;
        }
      `}</style>
    </span>
  )
}

AvatarComponent.displayName = 'BolioUIAvatar'
const Avatar = withScale(AvatarComponent)
export default Avatar
