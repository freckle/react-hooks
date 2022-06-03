import type { MaybeCleanUpFn } from './../types';
import { type ExtraDeps, type PrimitiveDep } from './../use-extra-deps';
export declare const useSafeEffect: (effect: () => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>) => void;
export declare const useSafeEffectExtraDeps: <T extends { [P in keyof S]: S[P] extends ExtraDeps<infer R> ? R : never; }, S extends {
    [key: string]: unknown;
} = {}>(effect: (a: T) => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>, extraDeps: S) => void;
