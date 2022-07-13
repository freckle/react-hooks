import * as React from 'react'
import {render} from '@testing-library/react'
import {useSafeCallback, useSafeCallbackExtraDeps} from '.'

describe('useSafeCallback', () => {
  it('works with dep', async () => {
    let f
    const A = ({p1}: {p1: number}) => {
      f = useSafeCallback(() => () => p1, [p1])
      return null
    }
    const {rerender} = render(<A p1={0} />)
    let cbF = f

    // f stays the same reference when prop stays the same
    rerender(<A p1={0} />)
    expect(cbF).toBe(f)
    cbF = f

    // f changes reference when prop changes
    rerender(<A p1={1} />)
    expect(cbF).not.toBe(f)
  })
})

describe('useSafeCallbackExtraDeps', () => {
  it('works with extra deps', async () => {
    const countTrue = jest.fn((arr: Array<boolean>): number => arr.filter(x => x === true).length)
    const arr1 = [true, false, true]
    const arr2 = [false, true]
    let f
    const A = ({p1}: {p1: boolean[]}) => {
      f = useSafeCallbackExtraDeps(
        ({p1}) =>
          () => {
            countTrue(p1)
          },
        [],
        {
          p1: {value: p1, comparator: (a: boolean[], b: boolean[]) => a.length === b.length}
        }
      )
      return null
    }
    const {rerender} = render(<A p1={arr1} />)
    let cbF = f

    // f stays the same reference when prop stays the same
    rerender(<A p1={arr1} />)
    expect(cbF).toBe(f)
    cbF = f

    // f changes reference when prop changes
    rerender(<A p1={arr2} />)
    expect(cbF).not.toBe(f)
  })
})
