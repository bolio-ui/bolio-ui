import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import useTheme from '../use-theme'
import ImageSkeleton from './ImageSkeleton'
import { transformDataSource } from './helpers'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Image.module.css'

interface Props {
  src: string
  disableSkeleton?: boolean
  className?: string
  maxDelay?: number
}

type NativeAttrs = Omit<React.ImgHTMLAttributes<AnyElement>, keyof Props>
export type ImageProps = Props & NativeAttrs

const ImageComponent = React.forwardRef<
  HTMLImageElement,
  React.PropsWithChildren<ImageProps>
>(
  (
    {
      src,
      disableSkeleton = false,
      className = '',
      maxDelay = 3000,
      style,
      ...props
    },
    ref
  ) => {
    const { SCALES, getScaleProps } = useScale()
    const width = getScaleProps(['width', 'w'])
    const height = getScaleProps(['height', 'h'])
    const showAnimation = !disableSkeleton && width && height

    const theme = useTheme()
    const [loading, setLoading] = useState<boolean>(true)
    const [showSkeleton, setShowSkeleton] = useState<boolean>(true)
    const imageRef = useRef<HTMLImageElement>(null)
    useImperativeHandle(ref, () => imageRef.current as HTMLImageElement)
    const url = useMemo(() => transformDataSource(src), [src])

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
      }, maxDelay)
      return () => clearTimeout(timer)
    }, [loading, maxDelay, showAnimation])

    const imageStyle: React.CSSProperties = {
      borderRadius: theme.layout.radius,
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0, 'auto')} ${SCALES.mb(0)} ${SCALES.ml(0, 'auto')}`,
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`
    }

    return (
      <div className={useClasses('image', styles.image, className)} style={imageStyle}>
        {showSkeleton && showAnimation && (
          <ImageSkeleton opacity={loading ? 1 : 0} />
        )}
        <img
          ref={imageRef}
          onLoad={imageLoaded}
          src={url}
          {...props}
          className={styles.img}
          style={{
            width: SCALES.width(1, 'auto'),
            height: SCALES.height(1, 'auto'),
            ...style
          }}
        />
      </div>
    )
  }
)

ImageComponent.displayName = 'BolioUIImage'
const Image = withScale(ImageComponent)
export default Image
