export declare type PrimitiveDep = boolean | string | number | null | void | symbol | CallbackFn<(...v: any) => any>;
declare const __brand: unique symbol;
export declare type CallbackFn<F> = F & {
    [__brand]: "CallbackFn";
};
export declare function unsafeMkCallbackFn<F extends (...v: any) => any>(callback: F): CallbackFn<F>;
export declare type ExtraDeps<V> = {
    value: V;
    comparator: (a: V, b: V) => boolean;
};
export declare function useExtraDeps<T extends Record<string, unknown>>(deps: ReadonlyArray<PrimitiveDep>, extraDeps: {
    [P in keyof T]: T[P] extends infer R ? ExtraDeps<R> : never;
}): {
    allDeps: ReadonlyArray<any>;
    extraDepValues: T;
};
export {};
