import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { BolioUIProvider, ModalsProvider, useModals } from '..'
import type { ModalsApi } from '..'

let api: ModalsApi

const Capture = () => {
  api = useModals()
  return null
}

const setup = (labels?: { confirm?: string; cancel?: string }) =>
  render(
    <BolioUIProvider>
      <ModalsProvider labels={labels}>
        <Capture />
        <p>app</p>
      </ModalsProvider>
    </BolioUIProvider>
  )

describe('<ModalsProvider />', () => {
  it('renders the app and no modal at the start', () => {
    setup()
    expect(screen.getByText('app')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens a modal from anywhere and returns its id', () => {
    setup()
    let id = ''
    act(() => {
      id = api.open({
        title: 'Welcome',
        subtitle: 'Hello there',
        children: 'Body text'
      })
    })
    expect(id).toEqual(expect.any(String))
    const dialog = screen.getByRole('dialog', { name: 'Welcome' })
    expect(dialog).toHaveTextContent('Hello there')
    expect(dialog).toHaveTextContent('Body text')
  })

  it('closes a modal by id', () => {
    setup()
    let id = ''
    act(() => {
      id = api.open({ title: 'One', children: 'a' })
      api.open({ title: 'Two', children: 'b' })
    })
    act(() => api.close(id))
    expect(screen.queryByText('One')).toBeNull()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('stacks modals, and closeAll closes every one', () => {
    setup()
    act(() => {
      api.open({ title: 'One', children: 'a' })
      api.open({ title: 'Two', children: 'b' })
      api.open({ title: 'Three', children: 'c' })
    })
    expect(screen.getAllByRole('dialog')).toHaveLength(3)
    act(() => api.closeAll())
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('updates an open modal', () => {
    setup()
    let id = ''
    act(() => {
      id = api.open({ title: 'Loading', children: 'wait' })
    })
    act(() => api.update(id, { title: 'Done', children: 'ready' }))
    expect(screen.getByRole('dialog', { name: 'Done' })).toHaveTextContent(
      'ready'
    )
  })

  it('replaces a modal that is opened again with the same id', () => {
    setup()
    act(() => {
      api.open({ id: 'same', title: 'First', children: 'a' })
      api.open({ id: 'same', title: 'Second', children: 'b' })
    })
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('calls onClose when the user closes it, and removes it', () => {
    const onClose = jest.fn()
    setup()
    act(() => {
      api.open({ title: 'Press', children: 'x', onClose })
    })
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      keyCode: 27
    })
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('does not call onClose when the code closes it', () => {
    const onClose = jest.fn()
    setup()
    let id = ''
    act(() => {
      id = api.open({ title: 'x', children: 'y', onClose })
    })
    act(() => api.close(id))
    expect(onClose).not.toHaveBeenCalled()
  })

  describe('confirm', () => {
    it('is an alert dialog with a confirm and a cancel action', () => {
      setup()
      act(() => {
        api.openConfirm({
          title: 'Delete?',
          children: 'This cannot be undone.'
        })
      })
      expect(
        screen.getByRole('alertdialog', { name: 'Delete?' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Confirm' })
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('runs onConfirm and closes', () => {
      const onConfirm = jest.fn()
      const onCancel = jest.fn()
      setup()
      act(() => {
        api.openConfirm({ title: 'Sure?', onConfirm, onCancel })
      })
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
      expect(onConfirm).toHaveBeenCalledTimes(1)
      expect(onCancel).not.toHaveBeenCalled()
      expect(screen.queryByRole('alertdialog')).toBeNull()
    })

    it('runs onCancel and closes', () => {
      const onConfirm = jest.fn()
      const onCancel = jest.fn()
      setup()
      act(() => {
        api.openConfirm({ title: 'Sure?', onConfirm, onCancel })
      })
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(onCancel).toHaveBeenCalledTimes(1)
      expect(onConfirm).not.toHaveBeenCalled()
      expect(screen.queryByRole('alertdialog')).toBeNull()
    })

    it('stays open when closeOnConfirm is false, to chain a step', () => {
      setup()
      act(() => {
        api.openConfirm({
          title: 'Step one',
          closeOnConfirm: false,
          onConfirm: () => {
            api.openConfirm({ title: 'Step two' })
          }
        })
      })
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
      expect(screen.getAllByRole('alertdialog')).toHaveLength(2)
    })

    it('takes the labels of the provider, and its own over them', () => {
      setup({ confirm: 'Sim', cancel: 'Não' })
      act(() => {
        api.openConfirm({ title: 'Apagar?' })
      })
      expect(screen.getByRole('button', { name: 'Sim' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Não' })).toBeInTheDocument()
      act(() => api.closeAll())
      act(() => {
        api.openConfirm({ title: 'Apagar?', labels: { confirm: 'Apagar' } })
      })
      expect(screen.getByRole('button', { name: 'Apagar' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Não' })).toBeInTheDocument()
    })
  })

  it('keeps the same api between renders', () => {
    const seen: ModalsApi[] = []
    const Spy = () => {
      seen.push(useModals())
      return null
    }
    const { rerender } = render(
      <BolioUIProvider>
        <ModalsProvider>
          <Spy />
        </ModalsProvider>
      </BolioUIProvider>
    )
    act(() => {
      seen[0].open({ title: 'x', children: 'y' })
    })
    rerender(
      <BolioUIProvider>
        <ModalsProvider>
          <Spy />
        </ModalsProvider>
      </BolioUIProvider>
    )
    expect(seen[seen.length - 1]).toBe(seen[0])
  })

  it('tells the developer when the provider is missing', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<Capture />)).toThrow(
      'useModals must be used inside <ModalsProvider>'
    )
    spy.mockRestore()
  })
})
