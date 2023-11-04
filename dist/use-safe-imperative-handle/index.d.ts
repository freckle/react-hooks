import * as React from 'react';
import { type ExtraDeps, type PrimitiveDep } from './../use-extra-deps';
export declare const useSafeImperativeHandle: <R>(ref: React.Ref<R>, handle: () => R, deps: ReadonlyArray<PrimitiveDep>) => void;
export declare const useSafeImperativeHandleExtraDeps: <R, T extends Record<string, unknown>>(ref: React.Ref<R>, handle: (a: T) => R, deps: ReadonlyArray<PrimitiveDep>, extraDeps: { [P in keyof T]: T[P] extends infer R_1 ? ExtraDeps<R_1> : never; }) => void;
