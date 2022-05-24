import type { MaybeCleanUpFn } from './../types';
import { type ExtraDeps, type PrimitiveDep } from './../use-extra-deps';
declare type $ObjMap<T extends {}, F extends (v: any) => any> = {
    [K in keyof T]: F extends (v: T[K]) => infer R ? R : never;
};
export declare const useSafeEffect: (effect: () => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>) => void;
export declare const useSafeEffectExtraDeps: <T extends { [P in keyof S]: S[P]; }, S extends {
    [key: string]: unknown;
}>(effect: (a: $ObjMap<S, <V>(a: ExtraDeps<V>) => V>) => MaybeCleanUpFn, deps: ReadonlyArray<PrimitiveDep>, extraDeps: S) => void;
export {};
