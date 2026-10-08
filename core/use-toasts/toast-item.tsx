import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import type { Toast, ToastLayout } from './use-toast'
import CssTransition from '../Shared/css-transition'
import { makeToastActions, getColors, getTranslateByPlacement } from './helpers'
import styles from './toast-item.module.css'
import { getSurface } from '../utils/surface'

export interface ToastItemProps {
  toast: Toast
  layout: Required<ToastLayout>
}

const ToastItem: React.FC<ToastItemProps> = React.memo(({ toast, layout }) => {
  const theme = useTheme()
  const { color, bgColor } = useMemo(
    () => getColors(theme.palette, toast.type),
    [theme.palette, toast.type]
  )
  const isReactNode = typeof toast.text !== 'string'
  const { padding, margin, maxHeight, placement } = layout
  const { enter, leave } = useMemo(
    () => getTranslateByPlacement(placement),
    [placement]
  )

  const surface = getSurface(theme, theme.expressiveness.shadowSmall)

  const toastStyle = {
    '--toast-item-max-height': maxHeight,
    '--toast-item-color': color,
    '--toast-item-bg':
      bgColor === theme.palette.background ? surface.bg : bgColor,
    '--toast-item-radius': theme.layout.radius,
    '--toast-item-shadow': surface.shadow,
    '--toast-item-margin': margin,
    '--toast-item-padding': padding,
    '--toast-item-enter-transform': enter,
    '--toast-item-leave-transform': leave
  } as React.CSSProperties

  return (
    <CssTransition name="toast" visible={toast.visible} clearTime={350}>
      <div
        key={toast.id}
        className={styles.toast}
        role={toast.type === 'error' ? 'alert' : 'status'}
        style={toastStyle}
      >
        {isReactNode ? (
          toast.text
        ) : (
          <>
            <div className={styles.message}>{toast.text}</div>
            <div className="action">
              {makeToastActions(toast.actions, toast.cancel)}
            </div>
          </>
        )}
      </div>
    </CssTransition>
  )
})

ToastItem.displayName = 'BolioUIToastItem'
export default ToastItem
