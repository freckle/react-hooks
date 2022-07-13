import invariant from 'invariant'
import * as React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {act} from 'react-dom/test-utils'
import {usePrevious} from '.'

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

describe('usePrevious', () => {
  it('keeps track of previous value', async () => {
    let previous

    const C = ({p}: {p: number}) => {
      previous = usePrevious(p)
      return <>{p}</>
    }

    // first render
    await act(async () => {
      render(<C p={0} />, container)
    })

    // second render
    await act(async () => {
      render(<C p={1} />, container)
    })

    // second render gives us value of p from first render
    expect(previous).toBe(0)

    // third render
    await act(async () => {
      render(<C p={2} />, container)
    })

    // third render gives us value of p from second render
    expect(previous).toBe(1)
  })
})
