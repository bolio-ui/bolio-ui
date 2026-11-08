import { useRef, useState } from 'react'
import type { FormRule } from './validators'
import { getPath } from './validators'

export type FormErrors = Record<string, string>
export type FormRules<Values> =
  Record<string, unknown> | ((values: Values) => FormErrors)

export type UseFormOptions<Values, Transformed = Values> = {
  initialValues: Values
  /** Shapes the values `onSubmit` hands to its handler. */
  transformValues?: (values: Values) => Transformed
  validate?: FormRules<Values>
  /** `true` validates every field on change, an array only the listed paths. */
  validateInputOnChange?: boolean | string[]
  /** `true` validates every field on blur, an array only the listed paths. */
  validateInputOnBlur?: boolean | string[]
  /** Runs after the values change, but not after `initialize`. */
  onValuesChange?: (values: Values) => void
}

export type GetInputPropsOptions = { type?: 'input' | 'checkbox' }

type FieldError = { error?: boolean; errorMessage?: string }
export type ValueFieldProps = FieldError & {
  // `any` so the props spread into any field, whatever type its value has
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (arg: any) => void
  onBlur: () => void
}
export type CheckboxFieldProps = FieldError & {
  checked: boolean
  onChange: (event: { target: { checked: boolean } }) => void
  onBlur: () => void
}

const setPath = <T>(source: T, path: string, value: unknown): T => {
  const [key, ...rest] = path.split('.')
  const copy: Record<string, unknown> | unknown[] = Array.isArray(source)
    ? [...source]
    : { ...(source as Record<string, unknown>) }
  const current = (copy as Record<string, unknown>)[key]
  ;(copy as Record<string, unknown>)[key] = rest.length
    ? setPath(current ?? {}, rest.join('.'), value)
    : value
  return copy as T
}

const collectErrors = (
  rules: Record<string, unknown>,
  values: unknown,
  prefix = '',
  errors: FormErrors = {}
): FormErrors => {
  Object.entries(rules).forEach(([key, rule]) => {
    const path = prefix ? `${prefix}.${key}` : key
    const value = getPath(values, path)
    if (typeof rule === 'function') {
      const message = (rule as FormRule)(value, values, path)
      if (message) errors[path] = message
    } else if (rule && typeof rule === 'object') {
      const nested = rule as Record<string, unknown>
      if (Array.isArray(value)) {
        value.forEach((_, index) =>
          collectErrors(nested, values, `${path}.${index}`, errors)
        )
      } else collectErrors(nested, values, path, errors)
    }
  })
  return errors
}

const without = (errors: FormErrors, path: string) =>
  Object.fromEntries(
    Object.entries(errors).filter(
      ([key]) => key !== path && !key.startsWith(`${path}.`)
    )
  )

const useForm = <Values extends Record<string, unknown>, Transformed = Values>({
  initialValues,
  transformValues,
  validate: rules,
  validateInputOnChange = false,
  validateInputOnBlur = false,
  onValuesChange
}: UseFormOptions<Values, Transformed>) => {
  const [initial, setInitial] = useState(initialValues)
  const valuesRef = useRef(initialValues)
  const [values, setValuesState] = useState(initialValues)
  const [errors, setErrorsState] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  const commit = (next: Values, notify = true) => {
    valuesRef.current = next
    setValuesState(next)
    if (notify) onValuesChange?.(next)
  }

  const runRules = (current: Values): FormErrors => {
    if (!rules) return {}
    return typeof rules === 'function'
      ? rules(current)
      : collectErrors(rules, current)
  }

  const shouldCheck = (option: boolean | string[], path: string) =>
    Array.isArray(option) ? option.includes(path) : option

  const validateField = (path: string, current = valuesRef.current) => {
    const message = runRules(current)[path]
    setErrorsState((last) => ({
      ...without(last, path),
      ...(message ? { [path]: message } : {})
    }))
    return !message
  }

  const validate = () => {
    const next = runRules(valuesRef.current)
    setErrorsState(next)
    return { hasErrors: Object.keys(next).length > 0, errors: next }
  }

  const clearFieldError = (path: string) =>
    setErrorsState((last) => without(last, path))

  const setFieldValue = (path: string, value: unknown) => {
    const next = setPath(valuesRef.current, path, value)
    commit(next)
    setTouched((last) => ({ ...last, [path]: true }))
    if (shouldCheck(validateInputOnChange, path)) validateField(path, next)
    else clearFieldError(path)
  }

  const editList = (path: string, edit: (list: unknown[]) => unknown[]) => {
    const list = (getPath(valuesRef.current, path) as unknown[]) ?? []
    commit(setPath(valuesRef.current, path, edit([...list])))
    setErrorsState((last) => without(last, path))
  }

  const isDirty = (path?: string) => {
    const same = (a: unknown, b: unknown) =>
      JSON.stringify(a) === JSON.stringify(b)
    return path
      ? !same(getPath(values, path), getPath(initial, path))
      : !same(values, initial)
  }

  const reset = () => {
    commit(initial)
    setErrorsState({})
    setTouched({})
  }

  const initialize = (next: Values) => {
    setInitial(next)
    commit(next, false)
    setErrorsState({})
    setTouched({})
  }

  const getTransformedValues = (current = valuesRef.current) =>
    (transformValues ? transformValues(current) : current) as Transformed

  const onSubmit =
    (
      handleValues: (values: Transformed, event?: React.FormEvent) => unknown,
      handleErrors?: (errors: FormErrors, values: Values) => void
    ) =>
    async (event?: React.FormEvent) => {
      event?.preventDefault()
      const result = validate()
      if (result.hasErrors)
        return handleErrors?.(result.errors, valuesRef.current)
      setSubmitting(true)
      try {
        await handleValues(getTransformedValues(), event)
      } finally {
        setSubmitting(false)
      }
    }

  function getInputProps(
    path: string,
    options: { type: 'checkbox' }
  ): CheckboxFieldProps
  function getInputProps(
    path: string,
    options?: { type?: 'input' }
  ): ValueFieldProps
  function getInputProps(
    path: string,
    { type = 'input' }: GetInputPropsOptions = {}
  ): CheckboxFieldProps | ValueFieldProps {
    const message = errors[path]
    const value = getPath(values, path)
    const onBlur = () => {
      setTouched((last) => ({ ...last, [path]: true }))
      if (shouldCheck(validateInputOnBlur, path)) validateField(path)
    }
    const error = message ? { error: true, errorMessage: message } : {}
    if (type === 'checkbox') {
      return {
        checked: Boolean(value),
        onChange: (event: { target: { checked: boolean } }) =>
          setFieldValue(path, event.target.checked),
        onBlur,
        ...error
      }
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: value as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: (arg: any) =>
        setFieldValue(
          path,
          arg && typeof arg === 'object' && 'target' in arg
            ? arg.target.value
            : arg
        ),
      onBlur,
      ...error
    }
  }

  return {
    values,
    errors,
    submitting,
    getInputProps,
    onSubmit,
    onReset: (event?: React.FormEvent) => {
      event?.preventDefault()
      reset()
    },
    reset,
    initialize,
    getValues: () => valuesRef.current,
    getTransformedValues,
    setInitialValues: setInitial,
    resetDirty: (next?: Values) => setInitial(next ?? valuesRef.current),
    resetTouched: () => setTouched({}),
    validate,
    validateField,
    setFieldValue,
    setValues: (next: Partial<Values>) =>
      commit({ ...valuesRef.current, ...next }),
    setErrors: setErrorsState,
    setFieldError: (path: string, message: string) =>
      setErrorsState((last) => ({ ...last, [path]: message })),
    clearErrors: () => setErrorsState({}),
    clearFieldError,
    insertListItem: (path: string, item: unknown, index?: number) =>
      editList(path, (list) => {
        list.splice(index ?? list.length, 0, item)
        return list
      }),
    removeListItem: (path: string, index: number) =>
      editList(path, (list) => list.filter((_, i) => i !== index)),
    reorderListItem: (
      path: string,
      { from, to }: { from: number; to: number }
    ) =>
      editList(path, (list) => {
        list.splice(to, 0, list.splice(from, 1)[0])
        return list
      }),
    isDirty,
    isTouched: (path?: string) =>
      path ? Boolean(touched[path]) : Object.keys(touched).length > 0
  }
}

export type UseFormReturn<
  Values extends Record<string, unknown>,
  Transformed = Values
> = ReturnType<typeof useForm<Values, Transformed>>

export default useForm
