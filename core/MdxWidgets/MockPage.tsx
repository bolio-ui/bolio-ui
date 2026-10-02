import React, { useEffect, useState } from 'react'
import { useTheme } from '../use-theme/theme-context'
import { joinClasses } from '../use-classes'
import styles from './MockPage.module.css'

interface Props {
  visible: boolean
  onClose?: () => void
}

const MockPage: React.FC<React.PropsWithChildren<Props>> = ({
  visible: customVisible,
  onClose,
  children
}) => {
  const theme = useTheme()
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    if (customVisible !== undefined) {
      setVisible(customVisible)
    }
  }, [customVisible])

  const clickHandler = () => {
    setVisible(false)
    if (onClose) onClose()
  }
  return (
    <section
      onClick={clickHandler}
      className={joinClasses(styles.section, visible && styles.active)}
      style={
        { '--mock-page-bg': theme.palette.background } as React.CSSProperties
      }
    >
      {children}
    </section>
  )
}

export default MockPage
