import React from 'react'
import { Link, Text, useTheme } from 'core'

interface Props {
  name: string
}

export type HeroProps = Props

function Logo({ name }: Props) {
  const theme = useTheme()

  return (
    <Link href="/" aria-label="Link to home page">
      <Text b>
        <svg
          viewBox="0 0 500 500"
          style={{
            color: '#c25fff',
            height: '2rem',
            width: '2rem',
            verticalAlign: 'middle',
            marginBottom: '3px'
          }}
        >
          <path
            d="M88.21,182.47c-.42-1.33,0,2.25,1.71,5.09,26.52,44.72,52.28,89.92,80.06,133.85C208.53,382.33,285.9,401,348.22,366c62.55-35.15,87-111.85,55.95-175.35-31.52-64.39-104.55-92.59-171.89-66C184.51,143.51,137,162.89,88.21,182.47Z"
            fill="currentColor"
          />
          <path
            d="M82.65,298.07c-1.06-.9,1.22,1.89,4.16,3.4,46.26,23.71,92.14,48.25,139.06,70.62,65.07,31,140.5,5.63,174.59-57.21,34.22-63.06,14.07-141-46.06-178.19C293.44,99,216.61,114,173.78,172.39,143.4,213.8,113.47,255.54,82.65,298.07Z"
            fill="currentColor"
          />
        </svg>
        <div className="container">{name}</div>
      </Text>
      <style jsx>{`
        .container {
          padding-left: 1px;
          display: inline-flex;
        }
        @media only screen and (max-width: ${theme.breakpoints.xs.max}) {
          .container {
            display: none;
          }
        }
      `}</style>
    </Link>
  )
}

export default Logo
