import { type ExtraDeps, type PrimitiveDep } from './../use-extra-deps';
import type { MaybeCleanUpFn } from './../types';
export declare const useSafeEffect: (effect: () => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>) => void;
export declare const useSafeEffectExtraDeps: <T extends Record<string, unknown>>(effect: (a: T) => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>, extraDeps: { [P in keyof T]: T[P] extends infer R ? ExtraDeps<R> : never; }) => void;
