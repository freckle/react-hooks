"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSafeCallback = useSafeCallback;
exports.useSafeCallbackExtraDeps = useSafeCallbackExtraDeps;

var React = _interopRequireWildcard(require("react"));

var _useExtraDeps2 = require("./../use-extra-deps");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useSafeCallback(f, deps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useSafeCallbackExtraDeps(function () {
    return f();
  }, deps, {});
}

function useSafeCallbackExtraDeps(f, deps, extraDeps) {
  var _useExtraDeps = (0, _useExtraDeps2.useExtraDeps)(deps, extraDeps),
      extraDepValues = _useExtraDeps.extraDepValues,
      allDeps = _useExtraDeps.allDeps; // eslint-disable-next-line react-hooks/exhaustive-deps


  var cb = React.useCallback(f(extraDepValues), allDeps); //$FlowFixMe: Can't unify `F` with useCallback but we know that they are the same

  var cbF = cb;
  return (0, _useExtraDeps2.unsafeMkCallbackFn)(cbF);
}