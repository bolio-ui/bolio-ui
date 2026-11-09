import React from 'react'
import Combobox from '../Combobox'
import type { ComboboxProps, ComboboxOption } from '../Combobox'

interface Props {
  data: Array<string | ComboboxOption>
  value?: string
  initialValue?: string
  onChange?: (value: string) => void
}

export type AutocompleteProps = Props &
  Omit<
    ComboboxProps,
    keyof Props | 'options' | 'freeText' | 'emptyText' | 'onInputChange'
  >

const toOption = (item: string | ComboboxOption): ComboboxOption =>
  typeof item === 'string' ? { value: item } : item

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ data, value, initialValue = '', onChange, ...props }, ref) => {
    const options = React.useMemo(() => data.map(toOption), [data])

    return (
      <Combobox
        ref={ref}
        freeText
        options={options}
        value={value}
        initialValue={initialValue}
        onChange={onChange as ComboboxProps['onChange']}
        {...props}
      />
    )
  }
)

Autocomplete.displayName = 'BolioUIAutocomplete'
export default Autocomplete
