// @flow

import * as React from "react";
import pickBy from "lodash/pickBy";
import omitBy from "lodash/omitBy";
import isFunction from "lodash/isFunction";
import mapValues from "lodash/mapValues";
import values from "lodash/values";
import isEqual from "lodash/isEqual";

export type PrimitiveLangDep = boolean | string | number | null | void | symbol;

// Dependencies that are safe to use in the normal `useEffect` deps array
//
// `PrimitiveDep` is a generic type. Typically usage is to bind the type
// variable `PrimitiveDomainDep` to opaque types that wrap primitives.
export type PrimitiveDep<PrimitiveDomainDep> =
  | PrimitiveLangDep
  | PrimitiveDomainDep;

// Wrapper around a function that has been wrapped in `useSafeCallback`. This type is here to avoid
// cyclical dependencies.
export opaque type CallbackFn<F> = F;

export const unCallbackFn = <F>(fn: CallbackFn<F>): F => fn;

// Used only by `useSafeCallback`
export function unsafeMkCallbackFn<F: (...Array<any>) => any>(
  f: F
): CallbackFn<F> {
  return f;
}

export type ExtraDeps<V> =
  | {| value: V, comparator: (a: V, b: V) => boolean |}
  | CallbackFn<V>;

// Hook used to help avoid pitfalls surrounding misuse of objects and arrays in the deps of
// `useEffect` et. al.
//
// By only allowing `PrimitiveDep`s in the `deps` array and forcing functions and non-primitives
// through `extraDeps`, we can ensure that we are not doing naive reference equality like React
// does for the `deps` array.
//
// See `useSafeEffect` for usage of this hook
//
// Returns an object based upon deps and extraDeps:
// { allDeps: An array that is suitable to use as a deps array for things like `useEffect`
// , extraDepValues: An object that has the same keys as extraDeps but contains their plain values
// }
//
export function useExtraDeps<S: { [key: string]: any }, PrimitiveDomainDep>(
  deps: $ReadOnlyArray<PrimitiveDep<PrimitiveDomainDep>>,
  extraDeps: S
): {|
  allDeps: $ReadOnlyArray<any>,
  extraDepValues: $ObjMap<S, <V>(ExtraDeps<V>) => V>,
|} {
  const [run, setRun] = React.useState<symbol>(Symbol());
  const nonFnsRef = React.useRef(null);

  const fns = pickBy(extraDeps, isFunction);
  const nonFns = omitBy(extraDeps, isFunction);

  const hasChange = () => {
    if (nonFnsRef.current === null || nonFnsRef.current === undefined) {
      return true;
    }
    for (const key in nonFns) {
      if (
        !nonFns[key].comparator(nonFns[key].value, nonFnsRef.current[key].value)
      ) {
        return true;
      }
    }
    return false;
  };

  if (hasChange()) {
    setRun(Symbol());
    nonFnsRef.current = nonFns;
  }

  return {
    allDeps: [...deps, ...values(fns), run],
    extraDepValues: { ...mapValues(nonFns, ({ value }) => value), ...fns },
  };
}

export const idExtraDep = <V: { id: string }>(value: V): ExtraDeps<V> => ({
  value,
  comparator: (a, b) => a.id === b.id,
});

export const isEqualExtraDep = <V>(value: V): ExtraDeps<V> => ({
  value,
  comparator: (a: V, b: V): boolean => isEqual(a, b),
});
