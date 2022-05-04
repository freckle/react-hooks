declare type $ObjMap<T extends {}, F extends (v: any) => any> = {
    [K in keyof T]: F extends (v: T[K]) => infer R ? R : never;
};
export declare type PrimitiveDep = boolean | string | number | null | void | Symbol;
export declare type CallbackFn<F> = F;
export declare const unCallbackFn: <F>(fn: F) => F;
export declare function unsafeMkCallbackFn<F extends () => any>(f: F): CallbackFn<F>;
export declare type ExtraDeps<V> = {
    value: V;
    comparator: (a: V, b: V) => boolean;
} | CallbackFn<V>;
export declare function useExtraDeps<S extends {
    [key: string]: any;
}>(deps: ReadonlyArray<PrimitiveDep>, extraDeps: S): {
    allDeps: ReadonlyArray<any>;
    extraDepValues: $ObjMap<S, <V>(a: ExtraDeps<V>) => V>;
};
export {};
