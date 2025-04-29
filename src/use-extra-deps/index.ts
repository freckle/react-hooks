/* eslint @typescript-eslint/no-explicit-any: 0 */
import mapValues from 'lodash/mapValues'
import * as React from 'react'

// Dependencies that are safe to use in the normal `useEffect` deps array
export type PrimitiveDep =
  | boolean
  | string
  | number
  | null
  | void
  | symbol
  | CallbackFn<(...v: any) => any>

declare const __brand: unique symbol
// Wrapper around a function that has been wrapped in `useSafeCallback`. This
// type is here to avoid cyclical dependencies.
export type CallbackFn<F> = F & {[__brand]: 'CallbackFn'}

export function unsafeMkCallbackFn<F extends (...v: any) => any>(callback: F): CallbackFn<F> {
  return callback as CallbackFn<F>
}

export type ExtraDeps<V> = {
  value: V
  comparator: (a: V, b: V) => boolean
}

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
  const extraDepsRef = React.useRef<null | any>(null)
  const hasChange = () => {
    if (extraDepsRef.current === null || extraDepsRef.current === undefined) {
      return true
    }
    for (const key in extraDeps) {
      if (!extraDeps[key].comparator(extraDeps[key].value, extraDepsRef.current[key].value)) {
        return true
      }
    }
    return false
  }

  if (hasChange()) {
    setRun(Symbol())
    extraDepsRef.current = extraDeps
  }

  return {
    allDeps: [...deps, run],
    extraDepValues: mapValues(extraDeps, ({value}) => value) as T,
  }
}
