"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSafeEffectExtraDeps = exports.useSafeEffect = void 0;

var React = _interopRequireWildcard(require("react"));

var _useExtraDeps2 = require("./../use-extra-deps");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useSafeEffect = function useSafeEffect(effect, deps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useSafeEffectExtraDeps(function () {
    return effect();
  }, deps, {});
};

exports.useSafeEffect = useSafeEffect;

var useSafeEffectExtraDeps = function useSafeEffectExtraDeps(effect, deps, extraDeps) {
  var _useExtraDeps = (0, _useExtraDeps2.useExtraDeps)(deps, extraDeps),
      extraDepValues = _useExtraDeps.extraDepValues,
      allDeps = _useExtraDeps.allDeps;

  React.useEffect(function () {
    return effect(extraDepValues);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  allDeps);
};

exports.useSafeEffectExtraDeps = useSafeEffectExtraDeps;