import React, { createContext, useContext } from 'react'
import type { UseFormReturn } from './use-form'

// the form is typed by whoever reads it, the context only passes it along
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = createContext<UseFormReturn<any, any> | null>(null)

export const FormProvider = <
  Values extends Record<string, unknown>,
  Transformed = Values
>({
  form,
  children
}: {
  form: UseFormReturn<Values, Transformed>
  children?: React.ReactNode
}) => <FormContext.Provider value={form}>{children}</FormContext.Provider>

export const useFormContext = <
  Values extends Record<string, unknown> = Record<string, unknown>,
  Transformed = Values
>() => {
  const form = useContext(FormContext)
  if (!form) throw new Error('useFormContext must be used inside FormProvider')
  return form as UseFormReturn<Values, Transformed>
}
