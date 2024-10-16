import * as React from 'react'
import {render} from '@testing-library/react'
import {useSafeCallback, useSafeCallbackExtraDeps} from '.'

describe('useSafeCallback', () => {
  it('works with dep', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let f: any
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
  it('works with multiple arity function', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let f: any
    const A = ({ p1 }: { p1: number }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      f = useSafeCallback(() => (_a: any, _b: any) => p1, [p1])
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let f: any
    const A = ({p1}: {p1: boolean[]}) => {
      f = useSafeCallbackExtraDeps<() => void, {p1: boolean[]}>(
        ({p1}) =>
          () => {
            countTrue(p1)
          },
        [],
        {
          p1: {value: p1, comparator: (a, b) => a.length === b.length}
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

  it('works with any arity function', async () => {
    const countTrue = jest.fn((arr: Array<boolean>): number => arr.filter(x => x === true).length)
    const arr1 = [true, false, true]
    const arr2 = [false, true]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let f: any
    const A = ({p1}: {p1: boolean[]}) => {
      f = useSafeCallbackExtraDeps<(a: unknown, b: unknown) => void, {p1: boolean[]}>(
        ({p1}) =>
          (_a, _b) => {
            countTrue(p1)
          },
        [],
        {
          p1: {value: p1, comparator: (a, b) => a.length === b.length}
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
