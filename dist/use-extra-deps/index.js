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
exports.useExtraDeps = exports.unsafeMkCallbackFn = void 0;
/* eslint @typescript-eslint/no-explicit-any: 0 */
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const React = __importStar(require("react"));
function unsafeMkCallbackFn(callback) {
    return callback;
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
    const extraDepsRef = React.useRef(null);
    const hasChange = () => {
        if (extraDepsRef.current === null || extraDepsRef.current === undefined) {
            return true;
        }
        for (const key in extraDeps) {
            if (!extraDeps[key].comparator(extraDeps[key].value, extraDepsRef.current[key].value)) {
                return true;
            }
        }
        return false;
    };
    if (hasChange()) {
        setRun(Symbol());
        extraDepsRef.current = extraDeps;
    }
    return {
        allDeps: [...deps, run],
        extraDepValues: (0, mapValues_1.default)(extraDeps, ({ value }) => value)
    };
}
exports.useExtraDeps = useExtraDeps;
