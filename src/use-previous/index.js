/* @flow */

import * as React from "react";

export const usePrevious = <T>(value: T): ?T => {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
