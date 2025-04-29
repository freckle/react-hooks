import {render} from '@testing-library/react'
import isEqual from 'lodash/isEqual'
import * as React from 'react'

import {CallbackFn} from '../use-extra-deps'
import {useSafeCallback} from './../use-safe-callback'

import {useSafeImperativeHandle, useSafeImperativeHandleExtraDeps} from '.'

describe('useSafeImperativeHandle', () => {
  it('works with no deps', async () => {
    const cb = jest.fn().mockImplementation(() => ({a: 'b'}))
    const ref = React.createRef<{a: string}>()
    const C = ({p1}: {p1: number}) => {
      useSafeImperativeHandle(ref, cb, [])
      return <>{p1}</>
    }
    // Sanity check
    expect(cb).toHaveBeenCalledTimes(0)
    expect(ref.current).toEqual(null)

    // Runs handle on first render
    const {rerender} = render(<C p1={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    // Does not run handle on props change
    cb.mockImplementation(() => ({a: 'c'}))
    rerender(<C p1={1} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')
  })

  it('works with only primitive deps', async () => {
    const cb = jest.fn().mockImplementation(() => ({a: 'b'}))
    const ref = React.createRef<{a: string}>()
    const C = ({p1, p2}: {p1: number; p2: number}) => {
      useSafeImperativeHandle(ref, () => cb(p1), [p1])
      return <>{p2}</>
    }

    // Sanity check
    expect(cb).toHaveBeenCalledTimes(0)
    expect(ref.current).toEqual(null)

    // Runs handle on first render
    const {rerender} = render(<C p1={0} p2={-100} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    // Does not run handle when props change that are not in deps
    cb.mockImplementation(() => ({a: 'c'}))
    rerender(<C p1={0} p2={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    // Runs handle when props change that are in dep
    rerender(<C p1={2} p2={2} />)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(ref.current?.a).toEqual('c')
  })

  it('works with object as extra dep', async () => {
    const cb = jest.fn().mockImplementation(() => ({a: 'b'}))
    const ref = React.createRef<{a: string}>()
    const C = ({
      p1,
      p2
    }: {
      p1: {
        text: string
      }
      p2: number
    }) => {
      useSafeImperativeHandleExtraDeps<{a: string}, {say: {text: string}}>(
        ref,
        ({say}) => cb(say),
        [],
        {
          say: {value: p1, comparator: (a: {text: string}, b: {text: string}) => a.text === b.text}
        }
      )
      return <>{p2}</>
    }

    // Sanity check
    expect(cb).toHaveBeenCalledTimes(0)
    expect(ref.current).toEqual(null)

    const hi1 = {text: 'hi'}

    // Runs handle on first render
    const {rerender} = render(<C p1={hi1} p2={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenLastCalledWith(hi1)
    expect(ref.current?.a).toEqual('b')

    // Does not run handle when deps are same based on comparator
    const hi2 = {text: 'hi'}
    cb.mockImplementation(() => ({a: 'c'}))

    rerender(<C p1={hi2} p2={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    const hello = {text: 'hello'}

    // Runs handle when deps change
    rerender(<C p1={hello} p2={0} />)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenLastCalledWith(hello)
    expect(ref.current?.a).toEqual('c')
  })

  it('works with array as extra dep', async () => {
    const ref = React.createRef<{a: string}>()
    const cb = jest.fn().mockImplementation(() => ({a: 'b'}))

    const C = ({p1, p2}: {p1: Array<boolean>; p2: number}) => {
      useSafeImperativeHandleExtraDeps<{a: string}, {p1: boolean[]}>(ref, ({p1}) => cb(p1), [], {
        // Only run handle when array length changes, regardless of contents
        p1: {value: p1, comparator: (a, b) => a.length === b.length}
      })
      return <>{p2}</>
    }

    // Sanity check
    expect(cb).toHaveBeenCalledTimes(0)
    expect(ref.current).toEqual(null)

    const arr1 = [true, false, true]

    // Runs handle on first render
    const {rerender} = render(<C p1={arr1} p2={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenLastCalledWith(arr1)
    expect(ref.current?.a).toEqual('b')

    // Does not run handle when deps are same based on comparator
    const arr2 = [true, false, false]
    cb.mockImplementation(() => ({a: 'c'}))

    rerender(<C p1={arr2} p2={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    const arr3 = [true, false]

    // Runs handle when deps change
    rerender(<C p1={arr3} p2={0} />)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenLastCalledWith(arr3)
    expect(ref.current?.a).toEqual('c')
  })

  it('works with function dep', async () => {
    const ref = React.createRef<{a: string}>()
    const cb = jest.fn().mockImplementation(() => ({a: 'b'}))
    const f =
      (a: number) =>
      (b: number): number[] => [a, b]

    const A = ({p1, p2, p3}: {p1: number; p2: number; p3: number}) => {
      const cbF = useSafeCallback(() => {
        return f(p1)
      }, [p1])

      return <C p2={p2} p3={p3} f={cbF} />
    }

    const C = ({f, p2, p3}: {f: CallbackFn<(b: number) => number[]>; p2: number; p3: number}) => {
      useSafeImperativeHandleExtraDeps<{a: string}, {p3: number}>(
        ref,
        ({p3}) => cb(...f(p3)),
        [f],
        {p3: {value: p3, comparator: (a, b) => a === b}}
      )
      return <>{p2}</>
    }

    // Sanity check
    expect(cb).toHaveBeenCalledTimes(0)
    expect(ref.current).toEqual(null)

    // Runs handle on first render
    const {rerender} = render(<A p1={0} p2={0} p3={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenLastCalledWith(0, 0)
    expect(ref.current?.a).toEqual('b')

    // Does not run handle on non-dep props change
    cb.mockImplementation(() => ({a: 'c'}))
    rerender(<A p1={0} p2={1} p3={0} />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    // Does run handle on useCB dep change
    rerender(<A p1={1} p2={1} p3={0} />)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenLastCalledWith(1, 0)
    expect(ref.current?.a).toEqual('c')

    // Does run handle on useEffect dep change
    cb.mockImplementation(() => ({a: 'd'}))
    rerender(<A p1={1} p2={1} p3={1} />)
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb).toHaveBeenLastCalledWith(1, 1)
    expect(ref.current?.a).toEqual('d')
  })

  it('works with combination of object, arrays, and primitives', async () => {
    const ref = React.createRef<{a: string}>()
    const cb = jest.fn().mockImplementation(() => ({a: 'b'}))

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
      useSafeImperativeHandleExtraDeps<{a: string}, {p1: {text: string}; p2: string[]}>(
        ref,
        ({p1, p2}) => cb(p1.text, p2, p3, p4),
        [p3, p4],
        {
          p1: {value: p1, comparator: (a, b) => a.text === b.text},
          // Deep comparison of arrays
          p2: {value: p2, comparator: (a, b) => isEqual(a, b)}
        }
      )
      return <>{p1.text}</>
    }

    // Sanity check
    expect(cb).toHaveBeenCalledTimes(0)
    expect(ref.current).toEqual(null)

    // Runs effect on first render
    const {rerender} = render(<C p1={{text: 'test'}} p2={['a', 'b']} p3={3} p4 />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    // Does not run effect when props change memory locations
    cb.mockImplementation(() => ({a: 'c'}))
    rerender(<C p1={{text: 'test'}} p2={['a', 'b']} p3={3} p4 />)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(ref.current?.a).toEqual('b')

    // Runs effect when deps chnge
    cb.mockImplementation(() => ({a: 'd'}))
    rerender(<C p1={{text: 'test_foo'}} p2={['a', 'b']} p3={3} p4 />)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(ref.current?.a).toEqual('d')

    cb.mockImplementation(() => ({a: 'e'}))
    rerender(<C p1={{text: 'test_foo'}} p2={['b', 'a']} p3={3} p4 />)
    expect(cb).toHaveBeenCalledTimes(3)
    expect(ref.current?.a).toEqual('e')

    cb.mockImplementation(() => ({a: 'f'}))
    rerender(<C p1={{text: 'test_foo'}} p2={['b', 'a']} p3={4} p4 />)
    expect(cb).toHaveBeenCalledTimes(4)
    expect(ref.current?.a).toEqual('f')

    cb.mockImplementation(() => ({a: 'g'}))
    rerender(<C p1={{text: 'test_foo'}} p2={['b', 'a']} p3={4} p4={false} />)
    expect(cb).toHaveBeenCalledTimes(5)
    expect(ref.current?.a).toEqual('g')
  })
})
