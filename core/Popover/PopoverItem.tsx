import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import { usePopoverContext } from './PopoverContext'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './PopoverItem.module.css'

interface Props {
  line?: boolean
  title?: boolean
  disableAutoClose?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type PopoverItemProps = Props & NativeAttrs

function PopoverItemComponent({
  children,
  line = false,
  title = false,
  className = '',
  onClick,
  disableAutoClose = false,
  style,
  ...props
}: React.PropsWithChildren<PopoverItemProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()
  const { disableItemsAutoClose, onItemClick } = usePopoverContext()
  const hasHandler = Boolean(onClick)
  const dontCloseByClick =
    disableAutoClose || disableItemsAutoClose || title || line
  const classes = useClasses(
    styles.item,
    { [styles.line]: line, [styles.title]: title },
    className
  )

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(event)
    if (dontCloseByClick) {
      return event.stopPropagation()
    }
    onItemClick(event)
  }

  const itemStyle = line
    ? {
        backgroundColor: theme.palette.border,
        height: SCALES.height(0.0625),
        margin: `${SCALES.mt(0.35)} ${SCALES.mr(0)} ${SCALES.mb(0.35)} ${SCALES.ml(0)}`,
        width: SCALES.width(1, '100%'),
        '--popover-item-hover-color': theme.palette.foreground
      }
    : {
        color: title ? theme.palette.foreground : theme.palette.accents_5,
        fontSize: title ? SCALES.font(0.925) : SCALES.font(0.875),
        width: SCALES.width(1, 'auto'),
        height: SCALES.height(1, 'auto'),
        margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
        padding: `${SCALES.pt(0.5)} ${SCALES.pr(0.75)} ${SCALES.pb(0.5)} ${SCALES.pl(0.75)}`,
        cursor: hasHandler ? 'pointer' : 'default',
        '--popover-item-hover-color': theme.palette.foreground
      }

  return (
    <>
      <div
        className={classes}
        onClick={clickHandler}
        {...props}
        style={{ ...itemStyle, ...style } as React.CSSProperties}
      >
        {children}
      </div>
      {title && <PopoverItem line title={false} />}
    </>
  )
}

PopoverItemComponent.displayName = 'BolioUIPopoverItem'
const PopoverItem = withScale(PopoverItemComponent)
export default PopoverItem
