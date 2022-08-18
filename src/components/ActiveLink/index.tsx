import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'core'

export interface Props {
  onAcitve?: () => void
  href: string
  text: string
}

const ActiveLink: React.FC<Props> = React.memo(({ href, text }) => {
  const theme = useTheme()
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <>
      <Link href={href}>
        <a className={`link ${isActive ? 'active' : ''}`}>{text}</a>
      </Link>
      <style jsx>{`
        a {
          font: inherit;
        }

        span {
          font-size: 1rem;
          color: ${theme.palette.accents_4};
          font-weight: 400;
        }

        .link.active {
          color: ${theme.palette.link};
          font-weight: 600;
        }

        .link.active span {
          color: ${theme.palette.link};
          font-weight: 600;
        }
      `}</style>
    </>
  )
})

ActiveLink.displayName = 'ActiveLink'
export default ActiveLink
