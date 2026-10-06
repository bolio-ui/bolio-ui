import React, { useEffect, useRef, useState } from 'react'
import { Link, useTheme } from 'core'
import AnchorIcon from './anchor-icon'
import styles from './Anchor.module.css'

export interface Props {
  pure?: boolean
}

export const virtualAnchorEncode = (text?: string) => {
  if (!text) return undefined
  return text.trim().toLowerCase().replace(/ /g, '-')
}

const Anchor: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  pure
}) => {
  const theme = useTheme()
  const ref = useRef<HTMLAnchorElement>(null)
  const [id, setId] = useState<string | undefined>(
    typeof children === 'string' ? virtualAnchorEncode(children) : undefined
  )

  useEffect(() => {
    if (!ref.current) return
    setId(virtualAnchorEncode(ref.current.textContent || undefined))
  }, [])

  return (
    <span
      className={styles.parent}
      ref={ref}
      style={
        { '--anchor-icon': theme.palette.accents_5 } as React.CSSProperties
      }
    >
      <Link href={`#${id}`}>{children}</Link>
      <span className={styles.virtual} id={id} />
      {!pure && (
        <span className={styles.icon}>
          <AnchorIcon />
        </span>
      )}
    </span>
  )
}

export default Anchor
