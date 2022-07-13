import invariant from 'invariant'
import * as React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {act} from 'react-dom/test-utils'
import {useSafeCallback, useSafeCallbackExtraDeps} from '.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let container: HTMLElement = null as any

beforeEach(() => {
  container = document.createElement('div')
  invariant(document.body !== null, 'body is not null')
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container = null as any
})

describe('useSafeCallback', () => {
  it('works with dep', async () => {
    let f
    const A = ({p1}: {p1: number}) => {
      f = useSafeCallback(() => () => p1, [p1])
      return null
    }
    await act(async () => {
      render(<A p1={0} />, container)
    })
    let cbF = f

    // f stays the same reference when prop stays the same
    await act(async () => {
      render(<A p1={0} />, container)
    })
    expect(cbF).toBe(f)
    cbF = f

    // f changes reference when prop changes
    await act(async () => {
      render(<A p1={1} />, container)
    })
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
    await act(async () => {
      render(<A p1={arr1} />, container)
    })
    let cbF = f

    // f stays the same reference when prop stays the same
    await act(async () => {
      render(<A p1={arr1} />, container)
    })
    expect(cbF).toBe(f)
    cbF = f

    // f changes reference when prop changes
    await act(async () => {
      render(<A p1={arr2} />, container)
    })
    expect(cbF).not.toBe(f)
  })
})
