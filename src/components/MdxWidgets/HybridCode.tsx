import React, { ReactNode, useMemo, useRef } from 'react'
import { Code, CodeProps, useClipboard, useTheme, useToasts } from 'core'
import { Copy } from '@bolio-ui/icons'
import styles from './HybridCode.module.css'

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
  const theme = useTheme()
  const { copy } = useClipboard()
  const { setToast } = useToasts()

  const copyHandler = () => {
    copy(ref.current?.querySelector('pre')?.textContent ?? '')
    setToast({ text: 'Code copied!' })
  }

  return (
    <div className={styles.hybridCode} ref={ref}>
      <Code block name={name} {...tabProps}>
        {children}
      </Code>
      <button
        type="button"
        className={
          name || tabProps.tabs?.length
            ? `${styles.copy} ${styles.named}`
            : styles.copy
        }
        aria-label="Copy code"
        onClick={copyHandler}
      >
        <Copy fontSize={16} color={theme.palette.accents_5} />
      </button>
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
