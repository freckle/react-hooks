export declare type PrimitiveDep = boolean | string | number | null | void | symbol;
export declare type CallbackFn<F> = {
    callback: F;
};
export declare const unCallbackFn: <F>({ callback }: CallbackFn<F>) => F;
export declare function unsafeMkCallbackFn<F extends (...v: any) => any>(callback: F): CallbackFn<F>;
export declare type ExtraDeps<V> = {
    value: V;
    comparator: (a: V, b: V) => boolean;
} | CallbackFn<V>;
export declare function useExtraDeps<T extends Record<string, unknown>>(deps: ReadonlyArray<PrimitiveDep>, extraDeps: {
    [P in keyof T]: T[P] extends infer R ? ExtraDeps<R> : never;
}): {
    allDeps: ReadonlyArray<any>;
    extraDepValues: T;
};
