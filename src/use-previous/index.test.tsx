import {render} from '@testing-library/react'
import * as React from 'react'

import {usePrevious} from '.'

describe('usePrevious', () => {
  it('keeps track of previous value', async () => {
    let previous

    const C = ({p}: {p: number}) => {
      previous = usePrevious(p)
      return <>{p}</>
    }

    // first render
    const {rerender} = render(<C p={0} />)

    // second render
    rerender(<C p={1} />)

    // second render gives us value of p from first render
    expect(previous).toBe(0)

    // third render
    rerender(<C p={2} />)

    // third render gives us value of p from second render
    expect(previous).toBe(1)
  })
})
