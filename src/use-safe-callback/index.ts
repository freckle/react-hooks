/* eslint @typescript-eslint/no-explicit-any: 0 */
import * as React from 'react'
import {
  unsafeMkCallbackFn,
  useExtraDeps,
  type CallbackFn,
  type ExtraDeps,
  type PrimitiveDep
} from './../use-extra-deps'

export function useSafeCallback<F extends (v: any) => any>(
  f: () => F,
  deps: ReadonlyArray<PrimitiveDep>
): CallbackFn<F> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useSafeCallbackExtraDeps(() => f(), deps, {})
}

export function useSafeCallbackExtraDeps<
  F extends (v: any) => any,
  T extends Record<string, unknown>
>(
  f: (a: T) => F,
  deps: ReadonlyArray<PrimitiveDep>,
  extraDeps: {[P in keyof T]: T[P] extends infer R ? ExtraDeps<R> : never}
): CallbackFn<F> {
  const {extraDepValues, allDeps} = useExtraDeps<T>(deps, extraDeps)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cb = React.useCallback(f(extraDepValues), allDeps)

  const cbF: F = cb

  return unsafeMkCallbackFn(cbF)
}
