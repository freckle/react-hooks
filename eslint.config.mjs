import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import testingLibrary from 'eslint-plugin-testing-library'
import jestDom from 'eslint-plugin-jest-dom'

export default tseslint.config(
  {
    ignores: ['dist/', 'coverage/']
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended
    ],
    settings: {
      // Must be explicit: eslint-plugin-react's 'detect' calls a context API
      // that ESLint 10 removed, and throws while loading react/display-name
      react: {version: '19.2'}
    },
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}
      ],
      // TypeScript types the props instead
      'react/prop-types': 'off',
      // This package exists to wrap useEffect/useCallback, so the hooks it
      // exports need the same deps-array checking as the built-ins
      'react-hooks/exhaustive-deps': [
        'error',
        {additionalHooks: '(useAsync)|(useSafeEffect)|(useSafeCallback)'}
      ],
      'react-hooks/rules-of-hooks': 'error'
    }
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    extends: [testingLibrary.configs['flat/react'], jestDom.configs['flat/recommended']]
  }
)
