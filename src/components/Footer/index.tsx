import React from 'react'
import { Text, Link, useTheme } from 'core'
import { Heart } from '@bolio-ui/icons'

function Footer() {
  const theme = useTheme()

  return (
    <>
      <footer>
        <Text h6>
          MADE & DESIGNED WITH
          <Heart
            fill="red"
            stroke="red"
            height={12}
            width={12}
            style={{ marginLeft: 3, marginRight: 3 }}
          />
          BY{' '}
          <Link
            href="https://github.com/bolio-ui/"
            target="_blank"
            rel="noopener"
            underline
          >
            BOLIO
          </Link>
        </Text>
      </footer>
      <style jsx>{`
        footer {
          border-top: 1px solid ${theme.palette.border};
          padding: ${theme.layout.gap};
          text-align: center;
        }
      `}</style>
    </>
  )
}

export default Footer
