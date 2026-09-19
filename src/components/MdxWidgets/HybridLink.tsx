import React from 'react'
import { Link, LinkProps } from 'core'
import { useRouter } from 'next/router'
import { isPlainLeftClick } from 'src/utils/client-navigation'

export type HybridLinkProps = LinkProps

const HybridLink: React.FC<HybridLinkProps> = ({
  href = '#',
  children,
  ...props
}) => {
  const isRelativeUrl = !/^([a-z0-9]*:|.{0})\/\/.*$/gim.test(href)
  const router = useRouter()
  const { pathname } = router
  const isHomePage = pathname.includes('guide/getting-started')

  if (isRelativeUrl) {
    return (
      <Link
        color
        block
        href={href}
        {...props}
        onClick={(event) => {
          props.onClick && props.onClick(event)
          if (!isPlainLeftClick(event)) return
          event.preventDefault()
          router.push(href)
        }}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      target="_blank"
      color
      icon={!isHomePage}
      rel="noreferrer nofollow"
      {...props}
    >
      {children}
    </Link>
  )
}

export default HybridLink
