import invariant from 'invariant'
import last from 'lodash/last'
import * as React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {act} from 'react-dom/test-utils'
import {useExtraDeps} from '.'

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

describe('useExtraDeps', () => {
  it('works with extra deps', async () => {
    let symbol
    const C = ({p1}: {p1: number}) => {
      const {allDeps} = useExtraDeps([], {
        p1: {value: p1, comparator: (a: number, b: number) => a === b}
      })
      //The symbol is always the last thing in the allDeps array
      symbol = last(allDeps)
      return <>{p1}</>
    }
    await act(async () => {
      render(<C p1={0} />, container)
    })
    let lastSymbol = symbol

    //Symbol should stay the same if p1 stays the same
    await act(async () => {
      render(<C p1={0} />, container)
    })
    expect(lastSymbol).toBe(symbol)
    lastSymbol = symbol

    //Symbol should differ if p1 differs
    await act(async () => {
      render(<C p1={1} />, container)
    })
    expect(lastSymbol).not.toBe(symbol)
  })
})
