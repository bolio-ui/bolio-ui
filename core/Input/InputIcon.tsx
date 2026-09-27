import React from 'react'
import styles from './InputIcon.module.css'

export interface InputIconProps {
  icon?: React.ReactNode
  clickable?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

function InputIconComponent({ icon, clickable, onClick }: InputIconProps) {
  // a clickable icon is a real button, so it works with the keyboard too
  const Component = clickable ? 'button' : 'span'

  return (
    <Component
      type={clickable ? 'button' : undefined}
      className={styles.inputIcon}
      onClick={onClick as React.MouseEventHandler<HTMLElement>}
      style={{
        cursor: clickable ? 'pointer' : 'default',
        pointerEvents: clickable ? 'auto' : 'none'
      }}
    >
      {icon}
    </Component>
  )
}

InputIconComponent.displayName = 'BolioUIInputIcon'
const InputIcon = React.memo(InputIconComponent)
export default InputIcon
