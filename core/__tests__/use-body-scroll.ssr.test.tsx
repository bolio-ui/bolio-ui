/**
 * @jest-environment node
 */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { useBodyScroll } from '..'

// There is no document on the server. The hook used to return before its
// hooks there, and now runs them all and reads the document in an effect.
it('renders on the server, where there is no document', () => {
  expect(typeof document).toBe('undefined')
  const Page = () => {
    const [hidden] = useBodyScroll()
    return <p>{hidden ? 'locked' : 'free'}</p>
  }
  expect(renderToString(<Page />)).toContain('free')
})
