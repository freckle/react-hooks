import * as React from 'react'

import type {MaybeCleanUpFn} from './../types'
import {type PrimitiveDep, type ExtraDeps, useExtraDeps} from './../use-extra-deps'

type $ObjMap<T extends {}, F extends (v: any) => any> = {
  [K in keyof T]: F extends (v: T[K]) => infer R ? R : never
}

export const useSafeEffect = (effect: () => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useSafeEffectExtraDeps(() => effect(), deps, {})
}

export const useSafeEffectExtraDeps = <
  S extends {
    [key: string]: ExtraDeps<any>
  }
>(
  effect: (a: $ObjMap<S, <V>(a: ExtraDeps<V>) => V>) => MaybeCleanUpFn,
  deps: ReadonlyArray<PrimitiveDep>,
  extraDeps: S
) => {
  const {extraDepValues, allDeps} = useExtraDeps(deps, extraDeps)

  React.useEffect(
    () => effect(extraDepValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    allDeps
  )
}
