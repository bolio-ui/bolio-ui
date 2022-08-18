import React from 'react'
import { useRouter } from 'next/router'
import { useTheme } from 'core'

export interface Props {
  name: string
}

const ActiveCategory: React.FC<Props> = React.memo(({ name, ...props }) => {
  const theme = useTheme()
  const router = useRouter()
  const isActive = router.asPath.includes(`/${name}/`)

  return (
    <span {...props} className={isActive ? 'active' : ''}>
      {name}
      <style jsx>{`
        span {
          font-size: 0.8125rem;
          transition: all 0.2s ease;
          color: ${theme.palette.accents_4};
          text-transform: uppercase;
          letter-spacing: 1.3px;
        }

        .active {
          color: red;
        }
      `}</style>
    </span>
  )
})

ActiveCategory.displayName = 'ActiveCategory'
export default ActiveCategory
