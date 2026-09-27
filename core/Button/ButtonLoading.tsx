import React from 'react'
import Loading from '../Loading'
import styles from './ButtonLoading.module.css'

interface Props {
  color: string
}

function ButtonLoading({ color }: Props) {
  return (
    <div className={styles.btnLoading}>
      <Loading color={color} />
    </div>
  )
}

ButtonLoading.displayName = 'BolioUIButtonLoading'
export default ButtonLoading
