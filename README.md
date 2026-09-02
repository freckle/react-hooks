# @freckle/react-hooks

Provides a collection of React hooks.

The key to this collection of hooks is the `useExtraDeps` hook. This hook
avoids the pitfalls of using objects and arrays as dependencies for React's
built-in `useEffect` hook. The other hooks are implemented in terms of
`useExtraDeps`. Please see the documentation for `useExtraDeps` for further
details.

## Install

```sh
pnpm add @freckle/react-hooks
```

## Collection

This package provides (in no particular order) the following React hooks:

0. `useSafeEffect` / `useSafeEffectExtraDeps`
0. `useSafeCallback` / `useSafeCallbackExtraDeps`
0. `usePrevious`
0. `useExtraDeps`

## Usage

Example usage of an object as a dependency:

```js
import { useSafeEffectExtraDeps } from "@freckle/react-hooks";
import { useSelector, useDispatch } from "react-redux";

export function StoreContainer(props: { color: Color }): React.Node {
  const dispatch = useDispatch();

  const { isLoading, itemsData, error } = useSelector(
    (state) => state.storeReducer
  );

  useSafeEffectExtraDeps(
    ({ color }) => {
      dispatch(loadItems(color));
    },
    [dispatch],
    {
      color: {
        value: props.color,
        comparator: (color1, color2) => color1.id === color2.id,
      },
    }
  );

  return <PiggyStore items={itemsData || []} error={error} />;
}
```

For simpler use cases, we can avoid the `extraDeps` bit:

```js
import {useSafeEffect} from '@freckle/react-hooks'
import {useSelector, useDispatch} from 'react-redux'

export function StoreContainer(): React.Node {
  const dispatch = useDispatch()

  const {isLoading, itemsData, error} = useSelector(
    state => state.storeReducer
  )

  useSafeEffect(() => {
    dispatch(loadItems())
  }, [dispatch])

  return (
    <PiggyStore items={itemsData || []} error={error} />
  )
}
```

## Development

- **Package manager**: pnpm (Node version pinned in `.nvmrc`)
- `pnpm build` — `tsc -p tsconfig.build.json`, emits to `dist/`
- `pnpm dev` — the same build in watch mode
- `pnpm test` / `pnpm test:watch` — Jest (jsdom)
- `pnpm coverage` — Jest with coverage, gated at 70% (lines/branches/functions/statements)
- `pnpm typecheck` — `tsc --noEmit`, includes test files
- `pnpm lint` — ESLint
- `pnpm format` / `pnpm format-check` — Prettier
- `pnpm knip` — unused files/dependencies/exports
- CI runs all of the above on every PR, plus a check that `dist/` is up to date

`dist/` is committed and is what gets published, so rerun `pnpm build` and commit the
result whenever you change `src/`.

## Release

See [RELEASE.md](./RELEASE.md).
