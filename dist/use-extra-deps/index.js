"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unCallbackFn = void 0;
exports.unsafeMkCallbackFn = unsafeMkCallbackFn;
exports.useExtraDeps = useExtraDeps;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var React = _interopRequireWildcard(require("react"));

var _pickBy = _interopRequireDefault(require("lodash/pickBy"));

var _omitBy = _interopRequireDefault(require("lodash/omitBy"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

var _mapValues = _interopRequireDefault(require("lodash/mapValues"));

var _values = _interopRequireDefault(require("lodash/values"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var unCallbackFn = function unCallbackFn(fn) {
  return fn;
}; // Used only by `useSafeCallback`


exports.unCallbackFn = unCallbackFn;

function unsafeMkCallbackFn(f) {
  return f;
}

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
  var _React$useState = React.useState(Symbol()),
      _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
      run = _React$useState2[0],
      setRun = _React$useState2[1];

  var nonFnsRef = React.useRef(null);
  var fns = (0, _pickBy["default"])(extraDeps, _isFunction["default"]);
  var nonFns = (0, _omitBy["default"])(extraDeps, _isFunction["default"]);

  var hasChange = function hasChange() {
    if (nonFnsRef.current === null || nonFnsRef.current === undefined) {
      return true;
    }

    for (var _key in nonFns) {
      if (!nonFns[_key].comparator(nonFns[_key].value, nonFnsRef.current[_key].value)) {
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
    allDeps: [].concat((0, _toConsumableArray2["default"])(deps), (0, _toConsumableArray2["default"])((0, _values["default"])(fns)), [run]),
    extraDepValues: _objectSpread(_objectSpread({}, (0, _mapValues["default"])(nonFns, function (_ref) {
      var value = _ref.value;
      return value;
    })), fns)
  };
}