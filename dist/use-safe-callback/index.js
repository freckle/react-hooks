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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.noopCallback = void 0;
exports.useSafeCallback = useSafeCallback;
exports.useSafeCallbackExtraDeps = useSafeCallbackExtraDeps;
/* eslint @typescript-eslint/no-explicit-any: 0 */
const React = __importStar(require("react"));
const use_extra_deps_1 = require("./../use-extra-deps");
function useSafeCallback(f, deps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useSafeCallbackExtraDeps(() => f(), deps, {});
}
function useSafeCallbackExtraDeps(f, deps, extraDeps) {
    const { extraDepValues, allDeps } = (0, use_extra_deps_1.useExtraDeps)(deps, extraDeps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cb = React.useCallback(f(extraDepValues), allDeps);
    const cbF = cb;
    return (0, use_extra_deps_1.unsafeMkCallbackFn)(cbF);
}
function noop() {
    return;
}
// noop is a stable reference so is safe to use as a `CallbackFn`
exports.noopCallback = (0, use_extra_deps_1.unsafeMkCallbackFn)(noop);
