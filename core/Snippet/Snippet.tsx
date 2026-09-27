import React, { useMemo, useRef } from 'react'
import useTheme from '../use-theme'
import { SnippetTypes, CopyTypes, NormalTypes } from '../utils/prop-types'
import { getStyles } from './styles'
import SnippetIcon from './SnippetIcon'
import useClipboard from '../utils/use-clipboard'
import useToasts from '../use-toasts'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Snippet.module.css'

export type ToastTypes = NormalTypes

interface Props {
  text?: string | string[]
  symbol?: string
  toastText?: string
  toastType?: ToastTypes
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  rounded?: boolean
  copy?: CopyTypes
  type?: SnippetTypes
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type SnippetProps = Props & NativeAttrs

const textArrayToString = (text: string[]): string => {
  return text.reduce((pre, current) => {
    if (!current) return pre
    return pre ? `${pre}\n${current}` : current
  }, '')
}

const SnippetComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SnippetProps>
>(
  (
    {
      type = 'default' as SnippetTypes,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      rounded = false,
      children,
      symbol = '$',
      toastText = 'Copied!',
      toastType = 'primary' as ToastTypes,
      text,
      copy: copyType,
      className = '',
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const { copy } = useClipboard()
    const { setToast } = useToasts()

    const preRef = useRef<HTMLPreElement>(null)
    const isMultiLine = text && Array.isArray(text)

    const style = useMemo(
      () =>
        getStyles(type, theme.palette, { fill: filled, light, ghost, subtle }),
      [type, theme.palette, filled, light, ghost, subtle]
    )

    const showCopyIcon = useMemo(() => copyType !== 'prevent', [copyType])

    const childText = useMemo<string | undefined | null>(() => {
      if (isMultiLine) return textArrayToString(text as string[])
      if (!children) return text as string
      if (!preRef.current) return ''
      return preRef.current.textContent
    }, [isMultiLine, text, children])

    const symbolBefore = useMemo(() => {
      const str = symbol.trim()
      return str ? `${str} ` : ''
    }, [symbol])

    const clickHandler = () => {
      if (!childText || !showCopyIcon) return
      copy(childText)
      if (copyType === 'silent') return
      setToast({ text: toastText, type: toastType })
    }

    const fontSize = SCALES.font(0.8125)
    const borderRadius = rounded ? '25px' : theme.layout.radius

    const snippetStyle: React.CSSProperties = {
      color: style.color,
      backgroundColor: style.bgColor,
      border: `1px solid ${style.border}`,
      borderRadius,
      fontSize,
      width: SCALES.width(1, 'initial'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0.667)} ${SCALES.pr(2.667)} ${SCALES.pb(0.667)} ${SCALES.pl(0.667)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...({ '--snippet-symbol': JSON.stringify(symbolBefore) } as React.CSSProperties),
      ...styleProp
    }

    return (
      <div
        ref={ref}
        className={useClasses(styles.snippet, className)}
        {...props}
        style={snippetStyle}
      >
        {isMultiLine ? (
          (text as string[]).map((t, index) => (
            <pre key={`snippet-${index}-${t}`}>{t}</pre>
          ))
        ) : (
          <pre ref={preRef}>{children || text}</pre>
        )}
        {showCopyIcon && (
          <div
            className={styles.copy}
            onClick={clickHandler}
            style={{
              backgroundColor: style.bgColor,
              alignItems: isMultiLine ? 'flex-start' : 'center',
              width: `calc(3.281 * ${fontSize})`,
              borderRadius,
              paddingTop: isMultiLine ? SCALES.pt(0.667) : 0
            }}
          >
            <SnippetIcon />
          </div>
        )}
      </div>
    )
  }
)

SnippetComponent.displayName = 'BolioUISnippet'
const Snippet = withScale(SnippetComponent)
export default Snippet
