import React from 'react'
import { Text, Link, Container, Grid, useTheme } from 'core'
import { Heart } from '@bolio-ui/icons'

function Footer() {
  const theme = useTheme()

  return (
    <>
      <div>
        <Container>
          <Grid.Container justify="center">
            <Grid>
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
            </Grid>
          </Grid.Container>
        </Container>
      </div>
      <style jsx>{`
        div {
          border-top: 1px solid ${theme.palette.border};
        }
      `}</style>
    </>
  )
}

export default Footer
