// This is used in React flow-interface as:
// useEffect( create: () => MaybeCleanUpFn, [...])
export type MaybeCleanUpFn = void | (() => void)
