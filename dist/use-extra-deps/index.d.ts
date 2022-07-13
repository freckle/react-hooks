export declare type PrimitiveDep = boolean | string | number | null | void | symbol;
export declare type CallbackFn<F> = F;
export declare const unCallbackFn: <F>(fn: F) => F;
export declare function unsafeMkCallbackFn<F extends (v: any) => any>(f: F): CallbackFn<F>;
export declare type ExtraDeps<V> = {
    value: V;
    comparator: (a: V, b: V) => boolean;
} | CallbackFn<V>;
export declare function useExtraDeps<T extends {
    [P in keyof S]: S[P] extends ExtraDeps<infer R> ? R : never;
}, S extends {
    [key: string]: ExtraDeps<unknown>;
} = Record<string, unknown>>(deps: ReadonlyArray<PrimitiveDep>, extraDeps: S): {
    allDeps: ReadonlyArray<any>;
    extraDepValues: T;
};
