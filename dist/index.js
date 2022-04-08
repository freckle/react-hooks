"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWord = void 0;

var helloWord = function helloWord() {
  return "Hello, World!";
};

exports.helloWord = helloWord;
("use strict");

var _ = require(".");

describe("helloWord", function () {
  test("is hello world", function () {
    expect((0, _.helloWord)()).toBe("Hello, World!");
  });
});
