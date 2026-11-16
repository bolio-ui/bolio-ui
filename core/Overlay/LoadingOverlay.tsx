import React from 'react'
import Overlay from './Overlay'
import type { OverlayProps } from './Overlay'
import Spinner from '../Spinner'

interface Props {
  // shows the layer, so the parent can toggle it with its loading state
  visible?: boolean
  // read by screen readers while the layer is visible
  label?: string
}

export type LoadingOverlayProps = Props & Omit<OverlayProps, 'children'>

// A layer with a Spinner over a loading area. The parent needs a position
// other than static, because the layer covers it.
const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ visible = true, label = 'Loading', blur = 1, ...props }, ref) => {
    if (!visible) return null
    return (
      <Overlay
        ref={ref}
        blur={blur}
        role="status"
        aria-label={label}
        {...props}
      >
        <Spinner />
      </Overlay>
    )
  }
)

LoadingOverlay.displayName = 'BolioUILoadingOverlay'
export default LoadingOverlay
