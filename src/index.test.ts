import * as reactHooks from '.'

const publicApi = [
  'noopCallback',
  'unsafeMkCallbackFn',
  'useExtraDeps',
  'usePrevious',
  'useSafeCallback',
  'useSafeCallbackExtraDeps',
  'useSafeEffect',
  'useSafeEffectExtraDeps',
  'useSafeImperativeHandle',
  'useSafeImperativeHandleExtraDeps'
] as const

describe('public API', () => {
  it('exports exactly the documented surface', () => {
    expect(Object.keys(reactHooks).sort()).toEqual([...publicApi])
  })

  // Reading each name matters on its own: the entry point is a barrel of
  // re-export getters, so a name can be listed but resolve to nothing
  it.each(publicApi)('resolves %s to a function', name => {
    expect(typeof reactHooks[name]).toBe('function')
  })
})

describe('noopCallback', () => {
  it('does nothing and returns undefined', () => {
    expect(reactHooks.noopCallback()).toBeUndefined()
  })

  it('is a stable reference', () => {
    expect(reactHooks.noopCallback).toBe(reactHooks.noopCallback)
  })
})
