import * as React from 'react'
import type { MaybeCleanUpFn } from './../types'
import { useExtraDeps, type ExtraDeps, type PrimitiveDep } from './../use-extra-deps'


export const useSafeEffect = (effect: () => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useSafeEffectExtraDeps(() => effect(), deps, {})
}

export const useSafeEffectExtraDeps = <
  T extends {[P in keyof S]: S[P] extends ExtraDeps<infer R> ? R : never},
  S extends {
    [key: string]: ExtraDeps<unknown>
  } = {}
>(
  effect: (a: T) => MaybeCleanUpFn,
  deps: ReadonlyArray<PrimitiveDep>,
  extraDeps: S
) => {
  const {extraDepValues, allDeps} = useExtraDeps<T>(deps, extraDeps)

  React.useEffect(
    () => effect(extraDepValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    allDeps
  )
}
