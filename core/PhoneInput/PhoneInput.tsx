import React, { useState } from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useUncontrolled from '../use-uncontrolled'
import Select from '../Select'
import Input from '../Input'
import type { NormalTypes } from '../utils/prop-types'
import { DEFAULT_COUNTRIES, flagOf } from './countries'
import type { PhoneCountry } from './countries'
import styles from './PhoneInput.module.css'

interface Props {
  // international number as "+" and digits, such as "+5511999999999"
  value?: string
  initialValue?: string
  onChange?: (value: string) => void
  countries?: PhoneCountry[]
  // ISO code of the country used while the number is empty
  defaultCountry?: string
  placeholder?: string
  countryLabel?: string
  disabled?: boolean
  type?: NormalTypes
  rounded?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'onChange' | 'defaultValue'
>
export type PhoneInputProps = Props & NativeAttrs

// The country of the longest calling code that starts the digits.
const parse = (value: string, countries: PhoneCountry[]) => {
  const digits = value.replace(/\D/g, '')
  const match = countries
    .filter((country) => digits.startsWith(country.dial))
    .sort((a, b) => b.dial.length - a.dial.length)[0]
  return match
    ? { country: match, national: digits.slice(match.dial.length) }
    : { country: undefined, national: digits }
}

const PhoneInputComponent = React.forwardRef<HTMLDivElement, PhoneInputProps>(
  (
    {
      value: customValue,
      initialValue = '',
      onChange,
      countries = DEFAULT_COUNTRIES,
      defaultCountry = 'US',
      placeholder = 'Phone number',
      countryLabel = 'Country',
      disabled = false,
      type = 'default',
      rounded = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const { SCALES } = useScale()
    const byCode = (code: string) =>
      countries.find((country) => country.code === code) || countries[0]

    const [value, setValue] = useUncontrolled<string>({
      value: customValue,
      defaultValue: initialValue,
      onChange
    })
    const parsed = parse(value, countries)
    const [chosen, setChosen] = useState(
      () => (parsed.country || byCode(defaultCountry)).code
    )
    // the number can start with a code shared by two countries (+1), so the
    // one the user picked wins while it has the same calling code
    const country =
      parsed.country && parsed.country.dial !== byCode(chosen).dial
        ? parsed.country
        : byCode(chosen)
    const national = parsed.country ? parsed.national : value.replace(/\D/g, '')

    const compose = (dial: string, digits: string) =>
      digits ? `+${dial}${digits}` : ''

    const wrapperStyle: React.CSSProperties = {
      width: SCALES.width(1, '100%'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        className={useClasses(styles.root, className)}
        style={wrapperStyle}
        {...props}
      >
        <Select
          aria-label={countryLabel}
          width="13em"
          clearable={false}
          disabled={disabled}
          type={type}
          rounded={rounded}
          initialValue={country.code}
          value={country.code}
          onChange={(code) => {
            const next = byCode(code as string)
            setChosen(next.code)
            setValue(compose(next.dial, national))
          }}
        >
          {countries.map((item) => (
            <Select.Option key={item.code} value={item.code}>
              {flagOf(item.code)} {item.name} +{item.dial}
            </Select.Option>
          ))}
        </Select>
        <Input
          htmlType="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-label={placeholder}
          placeholder={placeholder}
          width="100%"
          disabled={disabled}
          type={type}
          rounded={rounded}
          value={national}
          onChange={(event) =>
            setValue(
              compose(country.dial, event.target.value.replace(/\D/g, ''))
            )
          }
        />
      </div>
    )
  }
)

PhoneInputComponent.displayName = 'BolioUIPhoneInput'
const PhoneInput = withScale(PhoneInputComponent)
export default PhoneInput
