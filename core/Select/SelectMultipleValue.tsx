import React from 'react'
import useTheme from '../use-theme'
import Grid from '../Grid'
import SelectClearIcon from './SelectIconClear'
import styles from './SelectMultipleValue.module.css'

interface Props {
  disabled: boolean
  onClear: (() => void) | null
  // names the button that removes this value
  label?: string
  children: React.ReactNode
}

function SelectMultipleValue({ disabled, onClear, label, children }: Props) {
  const theme = useTheme()

  return (
    <Grid>
      <div
        className={styles.item}
        style={
          {
            '--select-multiple-value-radius': theme.layout.radius,
            '--select-multiple-value-bg': theme.palette.accents_3,
            '--select-multiple-value-color': disabled
              ? theme.palette.accents_5
              : theme.palette.accents_7
          } as React.CSSProperties
        }
      >
        {children}
        {!!onClear && <SelectClearIcon onClick={onClear} label={label} />}
      </div>
    </Grid>
  )
}

SelectMultipleValue.displayName = 'BolioUISelectMultipleValue'
export default SelectMultipleValue
