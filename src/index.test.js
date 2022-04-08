// @flow

import { helloWord } from ".";

describe("helloWord", () => {
  test("is hello world", () => {
    expect(helloWord()).toBe("Hello, World!");
  });
});
