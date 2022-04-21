# @freckle/react-hooks

Provides a collection of React hooks.

The key to this collection of hooks is the `useExtraDeps` hook. This hook
avoids the pitfalls of using objects and arrays as dependencies for React's
built-in `useEffect` hook. The other hooks are implemented in terms of
`useExtraDeps`. Please see the documentation for `useExtraDeps` for further
details.

## Collection

This package provides (in no particular order) the following React hooks:

0. `useSafeEffect` / `useSafeEffectExtraDeps`
0. `useSafeCallback` / `useSafeCallbackExtraDeps`
0. `usePrevious`
0. `useExtraDeps`

## Usage

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
