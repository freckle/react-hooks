import { type CallbackFn, type ExtraDeps, type PrimitiveDep } from './../use-extra-deps';
export declare function useSafeCallback<F extends (v: any) => any>(f: () => F, deps: ReadonlyArray<PrimitiveDep>): CallbackFn<F>;
export declare function useSafeCallbackExtraDeps<F extends (v: any) => any, T extends {
    [P in keyof S]: S[P] extends ExtraDeps<infer R> ? R : never;
}, S extends {
    [key: string]: ExtraDeps<unknown>;
} = Record<string, unknown>>(f: (a: T) => F, deps: ReadonlyArray<PrimitiveDep>, extraDeps: S): CallbackFn<F>;
