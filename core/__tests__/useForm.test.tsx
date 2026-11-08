import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor
} from '@testing-library/react'
import {
  Checkbox,
  Input,
  Radio,
  Select,
  Textarea,
  hasLength,
  isEmail,
  isInRange,
  isNotEmpty,
  matches,
  matchesField,
  useForm
} from 'core'

const setup = (options = {}) =>
  renderHook(() =>
    useForm({
      initialValues: {
        name: '',
        user: { email: '' },
        tags: [{ label: 'a' }],
        accepted: false
      },
      validate: {
        name: isNotEmpty('Informe o nome'),
        user: { email: isEmail('E-mail inválido') },
        tags: { label: isNotEmpty('Informe a tag') }
      },
      ...options
    })
  )

describe('useForm', () => {
  it('sets values by path and tracks dirty and touched', () => {
    const { result } = setup()
    expect(result.current.isDirty()).toBe(false)
    act(() => result.current.setFieldValue('user.email', 'a@b.co'))
    expect(result.current.values.user.email).toBe('a@b.co')
    expect(result.current.isDirty('user.email')).toBe(true)
    expect(result.current.isDirty('name')).toBe(false)
    expect(result.current.isTouched('user.email')).toBe(true)
    expect(result.current.isTouched()).toBe(true)
    act(() => result.current.setValues({ name: 'Ana' }))
    expect(result.current.values.name).toBe('Ana')
  })

  it('validates nested and list rules into flat error keys', () => {
    const { result } = setup()
    act(() => {
      result.current.setFieldValue('tags.0.label', '')
    })
    act(() => {
      result.current.validate()
    })
    expect(result.current.errors).toEqual({
      name: 'Informe o nome',
      'user.email': 'E-mail inválido',
      'tags.0.label': 'Informe a tag'
    })
    act(() => result.current.clearFieldError('name'))
    expect(result.current.errors.name).toBeUndefined()
    act(() => result.current.clearErrors())
    expect(result.current.errors).toEqual({})
  })

  it('accepts a function as the validate option', () => {
    const { result } = setup({
      validate: (values: { name: string }) =>
        values.name ? {} : { name: 'Obrigatório' }
    })
    act(() => {
      result.current.validate()
    })
    expect(result.current.errors).toEqual({ name: 'Obrigatório' })
  })

  it('clears a field error on change, or validates it when asked', () => {
    const { result } = setup()
    act(() => {
      result.current.validate()
    })
    act(() => result.current.setFieldValue('name', 'Ana'))
    expect(result.current.errors.name).toBeUndefined()

    const live = setup({ validateInputOnChange: ['name'] })
    act(() => live.result.current.setFieldValue('name', ''))
    expect(live.result.current.errors.name).toBe('Informe o nome')
    act(() => live.result.current.setFieldValue('name', 'Ana'))
    expect(live.result.current.errors.name).toBeUndefined()
  })

  it('validates on blur when asked', () => {
    const { result } = setup({ validateInputOnBlur: true })
    act(() => result.current.getInputProps('name').onBlur())
    expect(result.current.errors.name).toBe('Informe o nome')
    expect(result.current.isTouched('name')).toBe(true)
  })

  it('validateField returns whether the field is valid', () => {
    const { result } = setup()
    let valid = true
    act(() => {
      valid = result.current.validateField('name')
    })
    expect(valid).toBe(false)
    expect(result.current.errors.name).toBe('Informe o nome')
  })

  it('submits valid values and reports errors otherwise', async () => {
    const { result } = setup()
    const handleValues = jest.fn()
    const handleErrors = jest.fn()
    const preventDefault = jest.fn()
    const event = { preventDefault } as unknown as React.FormEvent

    await act(() => result.current.onSubmit(handleValues, handleErrors)(event))
    expect(preventDefault).toHaveBeenCalled()
    expect(handleValues).not.toHaveBeenCalled()
    expect(handleErrors).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Informe o nome' }),
      expect.any(Object)
    )

    act(() => {
      result.current.setValues({ name: 'Ana', user: { email: 'a@b.co' } })
    })
    await act(() => result.current.onSubmit(handleValues)())
    expect(handleValues).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ana' }),
      undefined
    )
    expect(result.current.submitting).toBe(false)
  })

  it('is submitting while the handler is pending', async () => {
    const { result } = setup({ validate: undefined })
    let finish = () => {}
    let pending: Promise<void> = Promise.resolve()
    act(() => {
      pending = result.current.onSubmit(
        () => new Promise<void>((resolve) => (finish = resolve))
      )()
    })
    expect(result.current.submitting).toBe(true)
    await act(async () => {
      finish()
      await pending
    })
    expect(result.current.submitting).toBe(false)
  })

  it('resets values, errors and touched', () => {
    const { result } = setup()
    act(() => result.current.setFieldValue('name', 'Ana'))
    act(() => {
      result.current.setFieldError('name', 'x')
    })
    act(() => result.current.reset())
    expect(result.current.values.name).toBe('')
    expect(result.current.errors).toEqual({})
    expect(result.current.isTouched()).toBe(false)
    const preventDefault = jest.fn()
    act(() =>
      result.current.onReset({ preventDefault } as unknown as React.FormEvent)
    )
    expect(preventDefault).toHaveBeenCalled()
  })

  it('edits lists and drops their stale errors', () => {
    const { result } = setup()
    act(() => result.current.insertListItem('tags', { label: 'b' }))
    act(() => result.current.insertListItem('tags', { label: 'z' }, 0))
    expect(result.current.values.tags.map((t) => t.label)).toEqual([
      'z',
      'a',
      'b'
    ])
    act(() => result.current.reorderListItem('tags', { from: 0, to: 2 }))
    expect(result.current.values.tags.map((t) => t.label)).toEqual([
      'a',
      'b',
      'z'
    ])
    act(() => result.current.setFieldError('tags.1.label', 'x'))
    act(() => result.current.removeListItem('tags', 1))
    expect(result.current.values.tags.map((t) => t.label)).toEqual(['a', 'z'])
    expect(result.current.errors).toEqual({})
  })

  it('builds input props for values, events and checkboxes', () => {
    const { result } = setup()
    act(() =>
      result.current
        .getInputProps('name')
        .onChange({ target: { value: 'Ana' } })
    )
    expect(result.current.getInputProps('name').value).toBe('Ana')
    act(() => result.current.getInputProps('name').onChange('Bia'))
    expect(result.current.values.name).toBe('Bia')
    act(() => result.current.getInputProps('user.email').onChange(null))
    expect(result.current.values.user.email).toBeNull()

    act(() =>
      result.current
        .getInputProps('accepted', { type: 'checkbox' })
        .onChange({ target: { checked: true } })
    )
    expect(
      result.current.getInputProps('accepted', { type: 'checkbox' }).checked
    ).toBe(true)

    expect(result.current.getInputProps('name').error).toBeUndefined()
    act(() => result.current.setFieldError('name', 'Erro'))
    expect(result.current.getInputProps('name')).toMatchObject({
      error: true,
      errorMessage: 'Erro'
    })
  })
})

describe('form validators', () => {
  it('isNotEmpty', () => {
    const rule = isNotEmpty('x')
    expect(
      ['', '  ', [], false, null, undefined].map((v) => rule(v, {}, ''))
    ).toEqual(Array(6).fill('x'))
    expect([' a', ['a'], true, 0].map((v) => rule(v, {}, ''))).toEqual([
      null,
      null,
      null,
      null
    ])
  })

  it('isEmail and matches', () => {
    expect(isEmail('x')('a@b.co', {}, '')).toBeNull()
    expect(isEmail('x')('a@b', {}, '')).toBe('x')
    expect(isEmail('x')(1, {}, '')).toBe('x')
    expect(matches(/^\d+$/, 'x')('12', {}, '')).toBeNull()
    expect(matches(/^\d+$/, 'x')('1a', {}, '')).toBe('x')
    expect(matches(/^\d+$/, 'x')(1, {}, '')).toBe('x')
  })

  it('hasLength', () => {
    expect(hasLength(3, 'x')('abc', {}, '')).toBeNull()
    expect(hasLength(3, 'x')('ab', {}, '')).toBe('x')
    expect(hasLength({ min: 2, max: 3 }, 'x')(' abcd ', {}, '')).toBe('x')
    expect(hasLength({ min: 2 }, 'x')(['a', 'b'], {}, '')).toBeNull()
    expect(hasLength({ max: 1 }, 'x')(['a', 'b'], {}, '')).toBe('x')
    expect(hasLength(1, 'x')(5, {}, '')).toBe('x')
  })

  it('isInRange', () => {
    const rule = isInRange({ min: 1, max: 3 }, 'x')
    expect(rule(2, {}, '')).toBeNull()
    expect(rule(0, {}, '')).toBe('x')
    expect(rule(4, {}, '')).toBe('x')
    expect(rule('2', {}, '')).toBe('x')
    expect(rule(NaN, {}, '')).toBe('x')
  })

  it('matchesField', () => {
    const rule = matchesField('a.b', 'x')
    expect(rule(1, { a: { b: 1 } }, '')).toBeNull()
    expect(rule(2, { a: { b: 1 } }, '')).toBe('x')
  })
})

describe('error on form fields', () => {
  it('renders the message and marks the field invalid', () => {
    render(
      <>
        <Textarea aria-label="t" error errorMessage="Erro textarea" />
        <Checkbox error errorMessage="Erro checkbox">
          c
        </Checkbox>
        <Radio value="1" error errorMessage="Erro radio">
          r
        </Radio>
        <Select error errorMessage="Erro select" />
      </>
    )
    ;['textarea', 'checkbox', 'radio', 'select'].forEach((name) =>
      expect(screen.getByText(`Erro ${name}`)).toBeInTheDocument()
    )
    expect(screen.getByLabelText('t')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('t')).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('-error')
    )
  })

  it('shows nothing without the error prop', () => {
    render(<Textarea aria-label="t" errorMessage="oculto" />)
    expect(screen.queryByText('oculto')).not.toBeInTheDocument()
  })
})

describe('useForm with fields', () => {
  const Demo = ({ onValues }: { onValues: (v: unknown) => void }) => {
    const form = useForm({
      initialValues: { name: '', bio: '', accepted: false },
      validate: {
        name: hasLength({ min: 3 }, 'Mínimo de 3 letras'),
        accepted: isNotEmpty('Aceite os termos')
      }
    })
    return (
      <form onSubmit={form.onSubmit(onValues)}>
        <Input aria-label="Nome" {...form.getInputProps('name')} />
        <Textarea aria-label="Bio" {...form.getInputProps('bio')} />
        <Checkbox {...form.getInputProps('accepted', { type: 'checkbox' })}>
          Termos
        </Checkbox>
        <button type="submit">Enviar</button>
      </form>
    )
  }

  it('fills fields, shows errors on submit and then submits', async () => {
    const onValues = jest.fn()
    render(<Demo onValues={onValues} />)

    fireEvent.click(screen.getByText('Enviar'))
    expect(await screen.findByText('Mínimo de 3 letras')).toBeInTheDocument()
    expect(screen.getByText('Aceite os termos')).toBeInTheDocument()
    expect(onValues).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Ana' }
    })
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'oi' } })
    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByText('Mínimo de 3 letras')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Enviar'))
    await waitFor(() =>
      expect(onValues).toHaveBeenCalledWith(
        { name: 'Ana', bio: 'oi', accepted: true },
        expect.anything()
      )
    )
  })
})
