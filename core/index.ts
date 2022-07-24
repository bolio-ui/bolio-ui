// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/// <reference types="styled-jsx" />

export { default as BolioUIProvider } from './bolio-ui-provider'
export type { BolioUIProviderProps } from './bolio-ui-provider'

export { default as Card } from './card'
export type { CardProps, CardContentProps, CardFooterProps } from './card'

export { default as Code } from './code'
export type { CodeProps } from './code'

export { default as Display } from './display'
export type { DisplayProps } from './display'

export { default as Grid } from './grid'
export type { GridProps, GridContainerProps } from './grid'

export { default as Image } from './image'
export type { ImageProps, ImageBrowserProps } from './image'

export * as ParsedCodes from './mdx-widgets'

export { default as Page } from './page'
export type {
  PageProps,
  PageHeaderProps,
  PageContentProps,
  PageFooterProps
} from './page'

export { default as Spacer } from './spacer'
export type { SpacerProps } from './spacer'

export { default as Text } from './text'
export type { TextProps } from './text'

export { default as Themes } from './themes'
export type { BolioUIThemes, BolioUIUserTheme } from './themes'

export { default as useAllThemes } from './use-all-themes'
export type { AllThemesConfig } from './use-all-themes'

export { default as useToasts } from './use-toasts'
export type { Toast, ToastInput, ToastAction, ToastLayout } from './use-toasts'

export { default as useBodyScroll } from './use-body-scroll'
export type { BodyScrollOptions } from './use-body-scroll'

export { default as useClipboard } from './use-clipboard'
export type { UseClipboardOptions } from './use-clipboard'

export { default as useMediaQuery } from './use-media-query'
export type { ResponsiveOptions, ResponsiveBreakpoint } from './use-media-query'

export { default as useKeyboard, KeyMod, KeyCode } from './use-keyboard'
export type { KeyboardOptions, UseKeyboardHandler } from './use-keyboard'

export { default as useInput } from './use-input'
export { default as useModal } from './use-modal'
export { default as useTabs } from './use-tabs'
export { default as useClickAway } from './use-click-away'
export { default as useCurrentState } from './use-current-state'
export { default as CssBaseline } from './css-baseline'
export { default as useTheme } from './use-theme'
export { default as useClasses } from './use-classes'
export { default as useScale } from './use-scale'
export { withScale, ScalePropKeys, ScaleContext } from './use-scale'
export type {
  ScaleProps,
  ScaleConfig,
  GetScalePropsFunction,
  GetAllScalePropsFunction
} from './use-scale'

export { useRect } from './utils/layouts'
export type { ReactiveDomReact } from './utils/layouts'
export { default as Highlight } from './shared/highlight'
export type { HighlightProps } from './shared/highlight'
