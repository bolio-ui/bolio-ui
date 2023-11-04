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
          font-size: 1.2rem;
          font-weight: 600;
          color: ${theme.palette.accents_8};
          letter-spacing: 0.5px;
        }

        .active {
          color: ${theme.palette.accents_8};
        }
      `}</style>
    </span>
  )
})

ActiveCategory.displayName = 'ActiveCategory'
export default ActiveCategory
