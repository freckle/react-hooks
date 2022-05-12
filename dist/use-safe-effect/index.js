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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSafeEffectExtraDeps = exports.useSafeEffect = void 0;
const React = __importStar(require("react"));
const use_extra_deps_1 = require("./../use-extra-deps");
const useSafeEffect = (effect, deps) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return (0, exports.useSafeEffectExtraDeps)(() => effect(), deps, {});
};
exports.useSafeEffect = useSafeEffect;
const useSafeEffectExtraDeps = (effect, deps, extraDeps) => {
    const { extraDepValues, allDeps } = (0, use_extra_deps_1.useExtraDeps)(deps, extraDeps);
    React.useEffect(() => effect(extraDepValues), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    allDeps);
};
exports.useSafeEffectExtraDeps = useSafeEffectExtraDeps;
