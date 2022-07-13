import invariant from 'invariant'
import isEqual from 'lodash/isEqual'
import * as React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {act} from 'react-dom/test-utils'
import {useSafeEffect, useSafeEffectExtraDeps} from '.'
import {useSafeCallback} from './../use-safe-callback'

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

describe('useSafeEffect', () => {
  it('works with no deps', async () => {
    const sideEffect = jest.fn()
    const C = ({p1}: {p1: number}) => {
      useSafeEffect(() => sideEffect(), [])
      return <>{p1}</>
    }

    // Sanity check
    expect(sideEffect).toHaveBeenCalledTimes(0)

    // Runs effect on first render
    await act(async () => {
      render(<C p1={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)

    // Does not run effect on props change
    await act(async () => {
      render(<C p1={1} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)
  })

  it('works with default param', async () => {
    const sideEffect = jest.fn()
    function fDefault(a = true) {
      sideEffect(a)
    }
    const C = ({p1}: {p1: number}) => {
      useSafeEffect(fDefault, [])
      return <>{p1}</>
    }
    await act(async () => {
      render(<C p1={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledWith(true)
  })

  it('works with only primitive deps', async () => {
    const sideEffect = jest.fn()
    const C = ({p1, p2}: {p1: number; p2: number}) => {
      useSafeEffect(() => sideEffect(p1), [p1])
      return <>{p2}</>
    }

    // Sanity check
    expect(sideEffect).toHaveBeenCalledTimes(0)

    // Runs effect on first render
    await act(async () => {
      render(<C p1={0} p2={-100} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)

    // Does not run effect when props change that are not in deps
    await act(async () => {
      render(<C p1={0} p2={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)

    // Runs effect when props change that are in dep
    await act(async () => {
      render(<C p1={2} p2={2} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(2)
  })

  it('works with object as extra dep', async () => {
    const sideEffect = jest.fn()
    const C = ({
      p1,
      p2
    }: {
      p1: {
        text: string
      }
      p2: number
    }) => {
      useSafeEffectExtraDeps(({say}) => sideEffect(say), [], {
        say: {value: p1, comparator: (a: {text: string}, b: {text: string}) => a.text === b.text}
      })
      return <>{p2}</>
    }

    // Sanity check
    expect(sideEffect).toHaveBeenCalledTimes(0)

    const hi1 = {text: 'hi'}

    // Runs effect on first render
    await act(async () => {
      render(<C p1={hi1} p2={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)
    expect(sideEffect).toHaveBeenLastCalledWith(hi1)

    // Does not run effect when deps are same based on comparator
    const hi2 = {text: 'hi'}

    await act(async () => {
      render(<C p1={hi2} p2={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)

    const hello = {text: 'hello'}

    // Runs effect when deps change
    await act(async () => {
      render(<C p1={hello} p2={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(2)
    expect(sideEffect).toHaveBeenLastCalledWith(hello)
  })

  it('works with array as extra dep', async () => {
    const countTrue = jest.fn((arr: Array<boolean>): number => arr.filter(x => x === true).length)

    const C = ({p1, p2}: {p1: Array<boolean>; p2: number}) => {
      useSafeEffectExtraDeps(
        ({p1}) => {
          // Cannot return anything except a clean-up function
          countTrue(p1)
        },
        [],
        {
          // Only run effect when array length changes, regardless of contents
          p1: {value: p1, comparator: (a: boolean[], b: boolean[]) => a.length === b.length}
        }
      )
      return <>{p2}</>
    }

    // Sanity check
    expect(countTrue).toHaveBeenCalledTimes(0)

    const arr1 = [true, false, true]

    // Runs effect on first render
    await act(async () => {
      render(<C p1={arr1} p2={0} />, container)
    })
    expect(countTrue).toHaveBeenCalledTimes(1)
    expect(countTrue).toHaveBeenLastCalledWith(arr1)
    expect(countTrue).toHaveReturnedWith(2)

    // Does not run effect when deps are same based on comparator
    const arr2 = [true, false, false]

    await act(async () => {
      render(<C p1={arr2} p2={0} />, container)
    })
    expect(countTrue).toHaveBeenCalledTimes(1)

    const arr3 = [true, false]

    // Runs effect when deps change
    await act(async () => {
      render(<C p1={arr3} p2={0} />, container)
    })
    expect(countTrue).toHaveBeenCalledTimes(2)
    expect(countTrue).toHaveBeenLastCalledWith(arr3)
    expect(countTrue).toHaveReturnedWith(1)
  })

  it('works with function dep', async () => {
    const sideEffect = jest.fn()
    const f =
      (a: number) =>
      (b: number): void => {
        sideEffect(a, b)
      }

    const A = ({p1, p2, p3}: {p1: number; p2: number; p3: number}) => {
      const cbF = useSafeCallback(() => {
        return f(p1)
      }, [p1])

      return <C p2={p2} p3={p3} f={cbF} />
    }
    const C = ({f, p2, p3}: {f: (v: any) => any; p2: number; p3: number}) => {
      useSafeEffectExtraDeps(
        ({p3, f}) => {
          return f(p3)
        },
        [],
        {p3: {value: p3, comparator: (a: number, b: number) => a === b}, f}
      )
      return <>{p2}</>
    }

    // Sanity check
    expect(sideEffect).toHaveBeenCalledTimes(0)

    // Runs effect on first render
    await act(async () => {
      render(<A p1={0} p2={0} p3={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)
    expect(sideEffect).toHaveBeenLastCalledWith(0, 0)

    // Does not run effect on non-dep props change
    await act(async () => {
      render(<A p1={0} p2={1} p3={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(1)

    // Does run effect on useCB dep change
    await act(async () => {
      render(<A p1={1} p2={1} p3={0} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(2)
    expect(sideEffect).toHaveBeenLastCalledWith(1, 0)

    // Does run effect on useEffect dep change
    await act(async () => {
      render(<A p1={1} p2={1} p3={1} />, container)
    })
    expect(sideEffect).toHaveBeenCalledTimes(3)
    expect(sideEffect).toHaveBeenLastCalledWith(1, 1)
  })

  it('works with combination of object, arrays, and primitives', async () => {
    const computation = jest.fn(
      (_textStr: string, _arr: Array<string>, _n: number, _bool: boolean): string => 'mock'
    )

    const C = ({
      p1,
      p2,
      p3,
      p4
    }: {
      p1: {
        text: string
      }
      p2: Array<string>
      p3: number
      p4: boolean
    }) => {
      useSafeEffectExtraDeps(
        ({p1, p2}) => {
          // Cannot return anything except a clean-up function
          computation(p1.text, p2, p3, p4)
        },
        [p3, p4],
        {
          p1: {value: p1, comparator: (a: {text: string}, b: {text: string}) => a.text === b.text},
          // Deep comparison of arrays
          p2: {value: p2, comparator: (a: string[], b: string[]) => isEqual(a, b)}
        }
      )
      return <>{p1.text}</>
    }

    // Sanity check
    expect(computation).toHaveBeenCalledTimes(0)

    // Runs effect on first render
    await act(async () => {
      render(<C p1={{text: 'test'}} p2={['a', 'b']} p3={3} p4 />, container)
    })
    expect(computation).toHaveBeenCalledTimes(1)

    // Does not run effect when props change memory locations
    await act(async () => {
      render(<C p1={{text: 'test'}} p2={['a', 'b']} p3={3} p4 />, container)
    })
    expect(computation).toHaveBeenCalledTimes(1)

    // Runs effect when deps chnge
    await act(async () => {
      render(<C p1={{text: 'test_foo'}} p2={['a', 'b']} p3={3} p4 />, container)
    })
    expect(computation).toHaveBeenCalledTimes(2)

    await act(async () => {
      render(<C p1={{text: 'test_foo'}} p2={['b', 'a']} p3={3} p4 />, container)
    })
    expect(computation).toHaveBeenCalledTimes(3)

    await act(async () => {
      render(<C p1={{text: 'test_foo'}} p2={['b', 'a']} p3={4} p4 />, container)
    })
    expect(computation).toHaveBeenCalledTimes(4)

    await act(async () => {
      render(<C p1={{text: 'test_foo'}} p2={['b', 'a']} p3={4} p4={false} />, container)
    })
    expect(computation).toHaveBeenCalledTimes(5)
  })

  it('runs clean-up function', async () => {
    const cleanup = jest.fn()
    const sideEffect = jest.fn((v: any) => cleanup)
    const C = ({
      p1,
      p2
    }: {
      p1: {
        text: string
      }
      p2: number
    }) => {
      useSafeEffectExtraDeps(({say}) => sideEffect(say), [], {
        say: {value: p1, comparator: (a: {text: string}, b: {text: string}) => a.text === b.text}
      })
      return <>{p2}</>
    }

    // Sanity check
    expect(cleanup).toHaveBeenCalledTimes(0)

    // Does not run clean-up on first render
    await act(async () => {
      render(<C p1={{text: 'hi'}} p2={0} />, container)
    })
    expect(cleanup).toHaveBeenCalledTimes(0)

    // Runs clean-up when effect runs
    await act(async () => {
      render(<C p1={{text: 'hello'}} p2={0} />, container)
    })
    expect(cleanup).toHaveBeenCalledTimes(1)

    // Does not run clean-up when effect does not run
    await act(async () => {
      render(<C p1={{text: 'hello'}} p2={0} />, container)
    })
    expect(cleanup).toHaveBeenCalledTimes(1)
  })
})
