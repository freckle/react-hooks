import * as React from 'react'
import {
  unsafeMkCallbackFn, useExtraDeps, type CallbackFn, type ExtraDeps, type PrimitiveDep
} from './../use-extra-deps'


type $ObjMap<T extends {}, F extends (v: any) => any> = {
  [K in keyof T]: F extends (v: T[K]) => infer R ? R : never
}

export function useSafeCallback<F extends (v: any) => any>(
  f: () => F,
  deps: ReadonlyArray<PrimitiveDep>
): CallbackFn<F> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useSafeCallbackExtraDeps(() => f(), deps, {})
}

export function useSafeCallbackExtraDeps<
  F extends (v: any) => any,
  S extends {
    [key: string]: any
  }
>(
  f: (a: $ObjMap<S, <V>(a: ExtraDeps<V>) => V>) => F,
  deps: ReadonlyArray<PrimitiveDep>,
  extraDeps: S
): CallbackFn<F> {
  const {extraDepValues, allDeps} = useExtraDeps(deps, extraDeps)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cb = React.useCallback(f(extraDepValues), allDeps)

  //$FlowFixMe: Can't unify `F` with useCallback but we know that they are the same
  const cbF: F = cb

  return unsafeMkCallbackFn(cbF)
}
