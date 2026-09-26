import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'

export type ElementStackItem = {
  overflow: string
  paddingRight: string
}

export type BodyScrollOptions = {
  scrollLayer?: boolean
  delayReset?: number
}

const defaultOptions: BodyScrollOptions = {
  scrollLayer: false,
  delayReset: 0
}

const elementStack = new Map<HTMLElement, ElementStackItem>()

const getOwnerPaddingRight = (element: Element): number => {
  const owner = element?.ownerDocument || document
  const view = owner.defaultView || window
  return Number.parseInt(view.getComputedStyle(element).paddingRight, 10) || 0
}

const getOwnerScrollbarWidth = (element: Element): number => {
  const doc = element?.ownerDocument || document
  return Math.abs(window.innerWidth - doc.documentElement.clientWidth)
}

function useBodyScroll(
  elementRef?: RefObject<HTMLElement | null> | null,
  options?: BodyScrollOptions
): [boolean, Dispatch<SetStateAction<boolean>>] {
  // The page body is the target when there is no ref. Hooks run on the
  // server too, where there is no document: it is only read in the effect.
  const bodyRef = useRef<HTMLElement | null>(null)
  const elRef = elementRef || bodyRef
  const [hidden, setHidden] = useState<boolean>(false)
  const { delayReset } = { ...defaultOptions, ...(options || {}) }

  useEffect(() => {
    if (!elementRef && !bodyRef.current) bodyRef.current = document.body
    if (!elRef || !elRef.current) return
    const lastOverflow = elRef.current.style.overflow
    if (hidden) {
      if (elementStack.has(elRef.current)) return
      const paddingRight = getOwnerPaddingRight(elRef.current)
      const scrollbarWidth = getOwnerScrollbarWidth(elRef.current)
      elementStack.set(elRef.current, {
        overflow: lastOverflow,
        paddingRight: elRef.current.style.paddingRight
      })
      elRef.current.style.overflow = 'hidden'
      elRef.current.style.paddingRight = `${paddingRight + scrollbarWidth}px`
      return
    }

    // reset element overflow
    if (!elementStack.has(elRef.current)) return

    const reset = (el: HTMLElement) => {
      const store = elementStack.get(el) as ElementStackItem
      if (!store) return
      el.style.overflow = store.overflow
      el.style.paddingRight = store.paddingRight
      elementStack.delete(el)
    }

    const timer = window.setTimeout(() => {
      reset(elRef.current!)
      window.clearTimeout(timer)
    }, delayReset)
  }, [hidden, elRef, elementRef, delayReset])

  return [hidden, setHidden]
}

export default useBodyScroll
