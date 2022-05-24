import { type CallbackFn, type ExtraDeps, type PrimitiveDep } from './../use-extra-deps';
declare type $ObjMap<T extends {}, F extends (v: any) => any> = {
    [K in keyof T]: F extends (v: T[K]) => infer R ? R : never;
};
export declare function useSafeCallback<F extends (v: any) => any>(f: () => F, deps: ReadonlyArray<PrimitiveDep>): CallbackFn<F>;
export declare function useSafeCallbackExtraDeps<F extends (v: any) => any, S extends {
    [key: string]: any;
}>(f: (a: $ObjMap<S, <V>(a: ExtraDeps<V>) => V>) => F, deps: ReadonlyArray<PrimitiveDep>, extraDeps: S): CallbackFn<F>;
export {};
