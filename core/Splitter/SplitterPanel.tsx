import React, { useContext } from 'react'
import { SplitterPanelContext } from './SplitterContext'
import useClasses from '../use-classes'
import styles from './Splitter.module.css'

interface Props {
  // percent of the room the panels share; the rest is split among the panels
  // without one
  defaultSize?: number
  minSize?: number
  maxSize?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type SplitterPanelProps = Props & NativeAttrs

const SplitterPanel = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SplitterPanelProps>
>(
  (
    {
      // read by the Splitter
      /* eslint-disable @typescript-eslint/no-unused-vars */
      defaultSize,
      minSize,
      maxSize,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const config = useContext(SplitterPanelContext)

    return (
      <div
        ref={(element) => {
          config?.setElement(element)
          if (typeof ref === 'function') ref(element)
          else if (ref) ref.current = element
        }}
        id={config?.id}
        className={useClasses(styles.panel, className)}
        {...props}
        style={style}
      >
        {children}
      </div>
    )
  }
)

SplitterPanel.displayName = 'BolioUISplitterPanel'
export default SplitterPanel
