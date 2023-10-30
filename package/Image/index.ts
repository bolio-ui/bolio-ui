import Image from './Image'
import ImageBrowser from './ImageBrowser'

export type ImageComponentType = typeof Image & {
  Browser: typeof ImageBrowser
}
;(Image as ImageComponentType).Browser = ImageBrowser

export type { ImageProps } from './Image'
export type { ImageBrowserProps, ImageAnchorProps } from './ImageBrowser'
export default Image as ImageComponentType
