import * as React from 'react'

import {useExtraDeps, type ExtraDeps, type PrimitiveDep} from './../use-extra-deps'

export const useSafeImperativeHandle = <R>(
  ref: React.Ref<R>,
  handle: () => R,
  deps: ReadonlyArray<PrimitiveDep>
) => {
  return useSafeImperativeHandleExtraDeps(ref, () => handle(), deps, {})
}

export const useSafeImperativeHandleExtraDeps = <R, T extends Record<string, unknown>>(
  ref: React.Ref<R>,
  handle: (a: T) => R,
  deps: ReadonlyArray<PrimitiveDep>,
  extraDeps: {[P in keyof T]: T[P] extends infer R ? ExtraDeps<R> : never}
) => {
  const {extraDepValues, allDeps} = useExtraDeps<T>(deps, extraDeps)

  React.useImperativeHandle(
    ref,
    () => handle(extraDepValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    allDeps
  )
}
