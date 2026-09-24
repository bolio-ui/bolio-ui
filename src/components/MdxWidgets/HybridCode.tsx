import React, { ReactNode, useMemo, useRef } from 'react'
import { Code, CodeProps, useClipboard, useToasts } from 'core'
import { Copy } from '@bolio-ui/icons'

export type HybridCodeProps = CodeProps
export const FILE_NAME_PREFIX = '// NAME:'
type HybridCodeChildrenAndName = {
  children: ReactNode | undefined
  name?: string | undefined
}

export const extractFileName = (
  children: ReactNode | undefined,
  stopDeep = false
): HybridCodeChildrenAndName => {
  if (!children) return { children }
  let name: string | undefined = undefined
  const next = React.Children.map(children, (child) => {
    if (name) return child
    if (!React.isValidElement<{ children?: ReactNode }>(child)) return null
    const grandson = child.props?.children
    if (
      typeof grandson === 'string' &&
      grandson?.startsWith(FILE_NAME_PREFIX)
    ) {
      name = grandson
      return null
    }
    if (!Array.isArray(grandson) || stopDeep) return child

    const { children: puredGrandson, name: puredName } = extractFileName(
      child.props?.children,
      true
    )
    if (!puredName) return child

    name = puredName
    const withoutSpaceAndNull = React.Children.toArray(puredGrandson).filter(
      (r, index) => {
        if (index === 0 && r === '\n') return false
        return !!r
      }
    )
    return React.cloneElement(
      child as React.ReactElement<{ children?: React.ReactNode }>,
      {
        children: withoutSpaceAndNull
      }
    )
  })
  return {
    children: next,
    name
  }
}

type CodeBlockProps = Pick<
  CodeProps,
  'name' | 'tabs' | 'activeTab' | 'onTabChange' | 'children'
>

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  name,
  ...tabProps
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { copy } = useClipboard()
  const { setToast } = useToasts()

  const copyHandler = () => {
    copy(ref.current?.querySelector('pre')?.textContent ?? '')
    setToast({ text: 'Code copied!' })
  }

  return (
    <div className="hybrid-code" ref={ref}>
      <Code block name={name} {...tabProps}>
        {children}
      </Code>
      <button
        type="button"
        className={name || tabProps.tabs?.length ? 'copy named' : 'copy'}
        aria-label="Copy code"
        onClick={copyHandler}
      >
        <Copy fontSize={16} color="#FFFFFF" />
      </button>
      <style jsx>{`
        .hybrid-code {
          position: relative;
        }
        .copy {
          position: absolute;
          top: 8px;
          right: 8px;
          display: inline-flex;
          padding: 4px;
          border: none;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
          opacity: 0;
        }
        .copy.named {
          top: 36px;
        }
        .hybrid-code:hover .copy,
        .copy:focus-visible {
          opacity: 0.7;
        }
        .copy:hover {
          opacity: 1;
        }
        @media (hover: none) {
          .copy {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}

const HybridCode: React.FC<HybridCodeProps> = ({ children }) => {
  const { children: withoutNameChildren, name } =
    useMemo<HybridCodeChildrenAndName>(
      () => extractFileName(children),
      [children]
    )
  const withoutPrefixName = useMemo(() => {
    if (!name) return name
    return name.replace(FILE_NAME_PREFIX, '')
  }, [name])

  return <CodeBlock name={withoutPrefixName}>{withoutNameChildren}</CodeBlock>
}

export default HybridCode
