import {render} from '@testing-library/react'
import last from 'lodash/last'
import * as React from 'react'

import {useExtraDeps} from '.'

describe('useExtraDeps', () => {
  it('works with extra deps', async () => {
    let symbol
    const C = ({p1}: {p1: number}) => {
      const {allDeps} = useExtraDeps<{p1: number}>([], {
        p1: {value: p1, comparator: (a, b) => a === b}
      })
      //The symbol is always the last thing in the allDeps array
      symbol = last(allDeps)
      return <>{p1}</>
    }
    const {rerender} = render(<C p1={0} />)
    let lastSymbol = symbol

    //Symbol should stay the same if p1 stays the same
    rerender(<C p1={0} />)
    expect(lastSymbol).toBe(symbol)
    lastSymbol = symbol

    //Symbol should differ if p1 differs
    rerender(<C p1={1} />)
    expect(lastSymbol).not.toBe(symbol)
  })

  // This test is only testing the types
  // It is expected to throw at runtime due to calling hooks outside of a React component
  it('rejects malformed deps at typelevel', () => {
    expect(() => {
      // @ts-expect-error can't pass object with wrong shape
      useExtraDeps([], {a: 1})
      // @ts-expect-error can't pass function
      useExtraDeps([], {a: () => 'hi'})
    }).toThrow()
  })
})
