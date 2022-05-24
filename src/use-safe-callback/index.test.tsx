import invariant from 'invariant'
import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useSafeCallback } from '.'

let container: HTMLElement = null as any

beforeEach(() => {
  container = document.createElement('div')
  invariant(document.body !== null, 'body is not null')
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
  container = null as any
})

describe('useSafeCallback', () => {
  it('works with dep', async () => {
    let f
    const A = ({p1}:{p1: number}) => {
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
