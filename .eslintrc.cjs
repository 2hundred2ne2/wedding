module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      typescript: true,
    },
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // esModuleInterop 하의 default export를 오탐지하는 케이스가 있어 끔 (tsc가 이미 검증함)
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
  },
};
