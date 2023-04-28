import { type CallbackFn, type ExtraDeps, type PrimitiveDep } from './../use-extra-deps';
export declare function useSafeCallback<F extends (...v: any) => any>(f: () => F, deps: ReadonlyArray<PrimitiveDep>): CallbackFn<F>;
export declare function useSafeCallbackExtraDeps<F extends (...v: any) => any, T extends Record<string, unknown>>(f: (a: T) => F, deps: ReadonlyArray<PrimitiveDep>, extraDeps: {
    [P in keyof T]: T[P] extends infer R ? ExtraDeps<R> : never;
}): CallbackFn<F>;
