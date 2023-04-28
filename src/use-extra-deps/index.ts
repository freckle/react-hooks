/* eslint @typescript-eslint/no-explicit-any: 0 */
import mapValues from 'lodash/mapValues'
import omitBy from 'lodash/omitBy'
import pickBy from 'lodash/pickBy'
import values from 'lodash/values'
import * as React from 'react'

// Dependencies that are safe to use in the normal `useEffect` deps array
export type PrimitiveDep = boolean | string | number | null | void | symbol

// Wrapper around a function that has been wrapped in `useSafeCallback`. This
// type is here to avoid cyclical dependencies.
export type CallbackFn<F> = {callback: F}

export const unCallbackFn = <F>({callback}: CallbackFn<F>): F => callback

// Used only by `useSafeCallback`
export function unsafeMkCallbackFn<F extends (...v: any) => any>(callback: F): CallbackFn<F> {
  return {callback}
}

export type ExtraDeps<V> =
  | {
      value: V
      comparator: (a: V, b: V) => boolean
    }
  | CallbackFn<V>

// Hook used to help avoid pitfalls surrounding misuse of objects and arrays in
// the deps of `useEffect` et. al.
//
// By only allowing `PrimitiveDep`s in the `deps` array and forcing functions
// and non-primitives through `extraDeps`, we can ensure that we are not doing
// naive reference equality like React does for the `deps` array.
//
// See `useSafeEffect` for usage of this hook
//
// Returns an object based upon deps and extraDeps: { allDeps: An array that is
// suitable to use as a deps array for things like `useEffect` , extraDepValues:
// An object that has the same keys as extraDeps but contains their plain values
// }
//
export function useExtraDeps<T extends Record<string, unknown>>(
  deps: ReadonlyArray<PrimitiveDep>,
  extraDeps: {[P in keyof T]: T[P] extends infer R ? ExtraDeps<R> : never}
): {
  allDeps: ReadonlyArray<any>
  extraDepValues: T
} {
  const [run, setRun] = React.useState<symbol>(Symbol())
  const nonFnsRef = React.useRef<null | any>(null)

  const fns: any = mapValues(
    pickBy(extraDeps, dep => 'callback' in dep),
    fn => (fn as any).callback
  )
  const nonFns: any = omitBy(extraDeps, dep => 'callback' in dep)
  const hasChange = () => {
    if (nonFnsRef.current === null || nonFnsRef.current === undefined) {
      return true
    }
    for (const key in nonFns) {
      if (!nonFns[key].comparator(nonFns[key].value, nonFnsRef.current[key].value)) {
        return true
      }
    }
    return false
  }

  if (hasChange()) {
    setRun(Symbol())
    nonFnsRef.current = nonFns
  }

  return {
    allDeps: [...deps, ...values(fns), run],
    extraDepValues: {...mapValues(nonFns, ({value}) => value), ...fns}
  }
}
