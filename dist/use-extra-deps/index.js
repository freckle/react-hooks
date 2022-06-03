"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExtraDeps = exports.unsafeMkCallbackFn = exports.unCallbackFn = void 0;
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const omitBy_1 = __importDefault(require("lodash/omitBy"));
const pickBy_1 = __importDefault(require("lodash/pickBy"));
const values_1 = __importDefault(require("lodash/values"));
const React = __importStar(require("react"));
const unCallbackFn = (fn) => fn;
exports.unCallbackFn = unCallbackFn;
// Used only by `useSafeCallback`
function unsafeMkCallbackFn(f) {
    return f;
}
exports.unsafeMkCallbackFn = unsafeMkCallbackFn;
// Hook used to help avoid pitfalls surrounding misuse of objects and arrays in
// the deps of `useEffect` et. al.
//
// By only allowing `PrimitiveDep`s in the `deps` array and forcing functions
// and non-primitives through `extraDeps`, we can ensure that we are not doing
// naive reference equality like React does for the `deps` array.
//
// See `useSafeEffect` for usage of this hook
//
// Returns an object based upon deps and extraDeps: { allDeps: An array that is
// suitable to use as a deps array for things like `useEffect` , extraDepValues:
// An object that has the same keys as extraDeps but contains their plain values
// }
//
function useExtraDeps(deps, extraDeps) {
    const [run, setRun] = React.useState(Symbol());
    const nonFnsRef = React.useRef(null);
    const fns = (0, pickBy_1.default)(extraDeps, isFunction_1.default);
    const nonFns = (0, omitBy_1.default)(extraDeps, isFunction_1.default);
    const hasChange = () => {
        if (nonFnsRef.current === null || nonFnsRef.current === undefined) {
            return true;
        }
        for (const key in nonFns) {
            if (!nonFns[key].comparator(nonFns[key].value, nonFnsRef.current[key].value)) {
                return true;
            }
        }
        return false;
    };
    if (hasChange()) {
        setRun(Symbol());
        nonFnsRef.current = nonFns;
    }
    return {
        allDeps: [...deps, ...(0, values_1.default)(fns), run],
        extraDepValues: Object.assign(Object.assign({}, (0, mapValues_1.default)(nonFns, ({ value }) => value)), fns)
    };
}
exports.useExtraDeps = useExtraDeps;
